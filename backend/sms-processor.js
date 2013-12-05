var Config = require("./config.js");
var PoliceContactHelper = require("./police-contact-helper.js");
var ReverseGeoCode = require("./reverse-geocode.js");

var GoogleVoice = require("./google-voice-helper.js")({
	email: Config.BUZZGUARDIAN_EMAIL,
	password: Config.BUZZGUARDIAN_PASSWORD,
	tokens: "./tokens.json"
});


var HashMap = require("./hash-map.js");
var DbLogger = require("./db-logger.js");

var mongoose = require("mongoose");

var connectToDb = function(){
	/* connect to Mongo when the app initializes */
	mongoose.connect(Config.DATABASE_URL);
};

/* The main execution thread */
var SMSProcessor = function(){
	/* Open a connection to the Database */
	connectToDb();

	var pendingQueue = new HashMap();
	var trackingQueue = new HashMap();

	/* check for unprocessed SMS every 5 seconds */
	var checkForSMS = setInterval(function(){
		GoogleVoice.getUnprocessedSMS(parseSMS);
	}, Config.Policy.SMS_POLLING_FREQUENCY);

	/* parse the unprocessed SMS */
	var parseSMS = function(data){
		if(data && data.length && data.length > 0){
			for(var i = 0; i < data.length; i++){
				/* tokenize SMS message by newline and spaces*/
				var messageComponents = data[i].message.split(/[\n ]+/);
				var request = messageComponents[3];

				/* create new sms object with latitude and longitude */
				var sms = {
					message : data[i].message,
					fromNumber: data[i].fromNumber,
					timestamp: data[i].timestamp,
					latitude: messageComponents[5],
					longitude: messageComponents[7],
					processed: false
				};

				handleRequest(request, sms);
			}
		}
	};

	var handleRequest = function(request, sms){
		/* Handle the different request types */
				switch(request){
					case "EMERGENCY":
						console.log("Received EMERGENCY Message from [" + sms.fromNumber + "]");
						processEmergency(sms)
						break;
					case "CANCEL":
						console.log("Received CANCEL Message from [" + sms.fromNumber + "]");
						processCancel(sms);
						break;
					case "TRACKING":
						console.log("Received TRACKING Message from [" + sms.fromNumber + "]");
						processTracking(sms);
						break;
					default:
						break;
				}
	};

	/* Handle the EMERGENCY message */
	var processEmergency = function(sms){
		/* log to db */
		DbLogger.logSms(sms);

		/* Add the SMS to the Pending Queue */
		pendingQueue.put(sms.fromNumber, sms);

		/* Add SMS to the Tracking Queue */
		trackingQueue.put(sms.fromNumber, sms);

		/* Handle the emergency if no CANCEL message arrives withing CANCEL_TIMEOUT */
		setTimeout(function(){
			handleLiveEmergency(sms);
		}, Config.Policy.CANCEL_TIMEOUT);

		/* Stop tracking after TRACKING_TIMEOUT */
		setTimeout(function(){
			stopTracking(sms);
		}, Config.Policy.TRACKING_TIMEOUT);

	};

	/* Handle the CANCEL message */
	var processCancel = function(sms){
		/* log to db */
		DbLogger.logCancel(sms);

		if(!pendingQueue.containsKey(sms.fromNumber)){
			console.error("No Emergency message in Queue to cancel for [" + sms.fromNumber + "]");
			return;
		}

		pendingQueue.remove(sms.fromNumber);
		trackingQueue.remove(sms.fromNumber);
	};

	/* Handle the TRACKING message */
	var processTracking = function(sms){
		/* log to db */
		DbLogger.logTracking(sms);

		console.log("Tracking SMS =====> " + sms);

		trackingQueue.put(sms.fromNumber, sms);
	};

	/* If an Emergency Message in the Pending Queue does not get a CANCEL message within CANCEL_TIMEOUT, we process the Emergency */
	var handleLiveEmergency = function(sms){
		/* In case the Pending queue does not contain the SMS, it means that a CANCEL message for it had arrived within CANCEL_TIMEOUT */
		if(!pendingQueue.containsKey(sms.fromNumber)){
			/* do nothing */
			return;
		}

		/* Send SMS to Police */
		console.log("Sending SMS to Police");
		var current = new Date();
		console.log("Time just before sending SMS to Police by " + sms.fromNumber + " =====> " + current);
		var smsTime = new Date(parseInt(sms.timestamp));
		DbLogger.logStats({
			smsTime: smsTime,
			policeSmsTime: current,
			timeTaken: current - smsTime
		});

		var onReverseCode = function(data){
			var policeMessage = sms.fromNumber + " needs HELP at " + data;

			GoogleVoice.sendSMS(PoliceContactHelper.getPoliceNumber({
				latitude: sms.latitude,
				longitude: sms.longitude
			}), policeMessage, function(error, response, data){
				if(error){
					console.error(error);
				}
			});

			/* remove the SMS from pending queue after an hour */
			sms.processed = true;
			setTimeout(function(){
				pendingQueue.remove(sms.fromNumber);
			}, Config.Policy.USER_TIMEOUT);
		};

		ReverseGeoCode.getAddress({
			latitude: sms.latitude,
			longitude: sms.longitude	
		}, onReverseCode);
	};

	/* Remove the entry for the number from the Tracking Queue */
	var stopTracking = function(sms){
		if(trackingQueue.containsKey(sms.fromNumber)){
			trackingQueue.remove(sms.fromNumber);
		}
	}
};


(function main(){
	console.log("Starting the Emergency Response System Backend");
	(new SMSProcessor());
})();


