var config = require("../config.js");

var GoogleVoice = require("../google-voice-helper.js")({
	email: config.BUZZGUARDIAN_TEST_EMAIL_DHEERAJ,
	password: config.BUZZGUARDIAN_TEST_PASSWORD_DHEERAJ,
	tokens: "./tests/tokens2.json"
});


/* Sends 1 Emergency Message followed by 10 Tracking Messages */
var emergencyTest = function(){
	var EMERGENCY_MESSAGE = "=== BuzzGuardian ===\n EMERGENCY\n" + "latitude= " + "33.7771" + "\nlongitude= " + "-84.3978" + "\ntimestamp= " + (new Date());
	var TRACKING_MESSAGE = "=== BuzzGuardian ===\n TRACKING\n" + "latitude= " + "33.7771" + "\nlongitude= " + "-84.3978" + "\ntimestamp= " + (new Date());

	var numTracking = 0;
	var timer;

	var onSendTracking = function(error, response, data){
		if(error){
			console.error(error);
		}else{
			console.log("Sent Tracking Message to =====> " + config.BUZZGUARDIAN_NUMBER);
			numTracking++;
			if(numTracking === 10){
				clearTimeout(timer);
			}	
		}
	};

	var onSendEmergency = function(error, response, data){
		if(error){
			console.error(error);
		}else{
			console.log("Sent Emergency Message to =====> " + config.BUZZGUARDIAN_NUMBER);
			timer = setInterval(function(){
				GoogleVoice.sendSMS(config.BUZZGUARDIAN_NUMBER, TRACKING_MESSAGE, onSendTracking);	
			}, config.TRACKING_FREQUENCY);
		}
	};

	var current = new Date();
	console.log("Time just before sending SMS to Server =====> " + current);
	GoogleVoice.sendSMS(config.BUZZGUARDIAN_NUMBER, EMERGENCY_MESSAGE, onSendEmergency);
};

/* Sends 1 Emergency Message followed by a Cancel Message after 5 seconds */
var cancelTest = function(){
	var EMERGENCY_MESSAGE = "=== BuzzGuardian ===\n EMERGENCY\n" + "latitude= " + "33.7771" + "\nlongitude= " + "-84.3978" + "\ntimestamp= " + (new Date());
	var CANCEL_MESSAGE = "=== BuzzGuardian ===\n CANCEL\n" + "latitude= " + "33.7771" + "\nlongitude= " + "-84.3978" + "\ntimestamp= " + (new Date());

	var onSendCancel = function(error, response, data){
		if(error){
			console.error(error);
		}else{
			console.log("Sent Cancel Message to =====> " + config.BUZZGUARDIAN_NUMBER);	
		}
	};

	var onSendEmergency = function(error, response, data){
		if(error){
			console.error(error);
		}else{
			console.log("Sent Emergency Message to =====> " + config.BUZZGUARDIAN_NUMBER);
			setTimeout(function(){
				GoogleVoice.sendSMS(config.BUZZGUARDIAN_NUMBER, CANCEL_MESSAGE, onSendCancel);
			}, 5000);		
		}
	};

	GoogleVoice.sendSMS(config.BUZZGUARDIAN_NUMBER, EMERGENCY_MESSAGE, onSendEmergency);
};

(function main(){
	emergencyTest();
	//cancelTest();
}());






