var config = require("../config.js");

var GoogleVoice = require("../google-voice-helper.js")({
	email: config.BUZZGUARDIAN_TEST_EMAIL,
	password: config.BUZZGUARDIAN_TEST_PASSWORD,
	tokens: "./tokens.json"
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

	GoogleVoice.sendSMS(config.BUZZGUARDIAN_NUMBER, EMERGENCY_MESSAGE, onSendEmergency);
};

(function main(){
	emergencyTest();
}());






