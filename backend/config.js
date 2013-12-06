module.exports = {
	POLICE_NUMBER_WITHIN: "+14048344474",
	POLICE_NUMBER_WITHOUT: "+14043761416",
	BUZZGUARDIAN_NUMBER: "+16787758612",
	BUZZGUARDIAN_TEST_NUMBER_RAMYA: "+14049695785",
	BUZZGUARDIAN_TEST_NUMBER_DHEERAJ: "+12677132872",
	BUZZGUARDIAN_TEST_NUMBER_SANDEEP: "+12677132191",

	BUZZGUARDIAN_EMAIL: "buzzguardian@gmail.com",
	BUZZGUARDIAN_PASSWORD: "gtbuzz00",

	BUZZGUARDIAN_TEST_EMAIL_RAMYA: "buzzguardiantest@gmail.com",
	BUZZGUARDIAN_TEST_PASSWORD_RAMYA: "gtbuzz00",
	BUZZGUARDIAN_TEST_EMAIL_DHEERAJ: "drdhkulkarni@gmail.com",
	BUZZGUARDIAN_TEST_PASSWORD_DHEERAJ: "1_dheeraj",
	BUZZGUARDIAN_TEST_EMAIL_SANDEEP: "buzzguardiantest2@gmail.com",
	BUZZGUARDIAN_TEST_PASSWORD_SANDEEP: "gtbuzz00",

	TRACKING_FREQUENCY: 60000,


	DATABASE_URL: "mongodb://localhost/ems",

	/* SMS Processor Policy Settings */
	Policy: {
		SMS_POLLING_FREQUENCY : 5000, /* How often do we poll Google Voice for new SMS data */
		CANCEL_TIMEOUT : 30000, /* How much time to wait for CANCEL request to arrive before triggering of emergency mechanism */
		TRACKING_TIMEOUT : 1800000, /* How long to track the Mobile Device */
		USER_TIMEOUT : 3600000 /* How long to wait before user can send the next emergency message */
	}
};