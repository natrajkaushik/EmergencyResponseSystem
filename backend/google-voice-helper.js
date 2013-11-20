var voice = require("voice.js");
var _ = require("underscore");

/* Google Voice client instance */
var client = new voice.Client({email: "buzzguardian@gmail.com", 
	password: "gtbuzz00", 
	tokens: require('./tokens.json')
});

var GoogleVoice = {
	/** 
	 * On every call, it returns all unread SMS from inbox and marks all unread messages as read.
     * @return a list containing SMS messages not retrieved by the previous call to getUnreadSMS().
	 */
	getUnprocessedSMS : function(callback){
		var unProcessedSMSList = [];
		var unProcessedConvos = [];

		var markAsRead = function(){
			 client.set("mark", {read: true, id:unProcessedConvos}, function(error, response, data){
             	if(error){
                	return console.error(error);       
                }

                callback(unProcessedSMSList);
             });
		};

		var onSMS = function(data){
			data.conversations_response.conversationgroup.forEach(function(convo){
				var currentConvo = convo.call;
				//console.log(currentConvo);
				for(var i = 0 ; i < currentConvo.length; i++){
					if(0 === currentConvo[i].status){
						var sms = currentConvo[i];
						unProcessedSMSList.push({fromNumber: sms.phone_number,
							message: sms.message_text,
							timestamp: sms.start_time
						});

						unProcessedConvos.push(currentConvo[i].conversation_id);
					}
				}

				unProcessedSMSList = _.uniq(unProcessedSMSList);
				unProcessedSMSList.sort(function(a, b){
					return a.start_time - b.start_time;
				});
				unProcessedConvos = _.uniq(unProcessedConvos);
			});

			markAsRead();
		};

		client.get("sms", {}, function(error, response, data){
			 if(error){
             	return console.error(error);
             }
        
             if(!data || !data.conversations_response || !data.conversations_response.conversationgroup){ 
             	return console.log('No conversations.')
             }
        
             /* execute the callback on receiving data */
             onSMS(data);
		});
	},

	/**
	 * send SMS to a given number
	 * @param toNumber the number to send SMS to
	 * @param msg the SMS text
	 * @param callback
	 */
	sendSMS: function(toNumber, msg, callback){
		client.sms({to: toNumber, 
			text: msg}, callback);
	}
};

var processSMS = function(data){
	if(data && data.length && data.length > 0){
		for(var i = 0; i < data.length; i++){
			console.log(data[i]);
		}
	}
};


module.exports = GoogleVoice;