var Sms = require("./models/Sms.js");
var TrackingSms = require("./models/TrackingSms.js");
var Stats = require("./models/Stats.js");

var RequestType = {
	SEND_ALERT: "SEND_ALERT",
	CANCEL_ALERT: "CANCEL_ALERT",
	TRACK: "TRACK"
};

var State = {
	PENDING: "PENDING",
	PROCESSED: "PROCESSED",
	TRACKING: "TRACKING"
};

/* Methods to log info to the database */
module.exports = {
	logSms: function(sms){
		new Sms({
			mobile: sms.fromNumber,
			timestamp: new Date(parseInt(sms.timestamp)),
			requestType: RequestType.SEND_ALERT,
			state: State.PENDING,
			latitude: parseFloat(sms.latitude),
			longitude: parseFloat(sms.longitude)
		}).save(function(err, result){
			if(err){
				console.log(err);
			}
		});
	},

	logCancel: function(sms){
		new Sms({
			mobile: sms.fromNumber,
			timestamp: new Date(parseInt(sms.timestamp)),
			requestType: RequestType.CANCEL_ALERT,
			state: State.PROCESSED,
			latitude: parseFloat(sms.latitude),
			longitude: parseFloat(sms.longitude)
		}).save(function(err, result){
			if(err){
				console.log(err);
			}
		});
	},

	logTracking: function(sms){
		new TrackingSms({
			mobile: sms.fromNumber,
			timestamp: new Date(parseInt(sms.timestamp)),
			requestType: RequestType.TRACK,
			state: State.TRACKING,
			latitude: parseFloat(sms.latitude),
			longitude: parseFloat(sms.longitude)
		}).save(function(err, result){
			if(err){
				console.log(err);
			}
		});	
	},

	logStats: function(data){
		new Stats({
			inTimestamp: data.smsTime,
			outTimestamp: data.policeSmsTime,
			timeTaken: data.timeTaken,
			requestType: RequestType.SEND_ALERT
		}).save(function(err, result){
			if(err){
				console.log(err);
			}
		});
	}
};