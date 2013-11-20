module.exports = {
	POLICE_NUMBER_WITHIN: "+14042195898",
	POLICE_NUMBER_WITHOUT: "+14043761416",
	BUZZGUARDIAN_NUMBER: "+16787758612",

	DATABASE_URL: "mongodb://localhost/ems",

	/* SMS Processor Policy Settings */
	Policy: {
		SMS_POLLING_FREQUENCY = 5000, /* How often do we poll Google Voice for new SMS data */
		CANCEL_TIMEOUT = 30000, /* How much time to wait for CANCEL request to arrive before triggering of emergency mechanism */
		TRACKING_TIMEOUT = 1800000, /* How long to track the Mobile Device */
		USER_TIMEOUT = 3600000 /* How long to wait before user can send the next emergency message */
	}
};