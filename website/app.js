var express = require("express");
var mongoose = require("mongoose");
var config = require("./config/config.js");
var fs = require("fs");

/* Bootstrap DB connection */
mongoose.connect(config.DATABASE_URL);

/* Bootstrap Models */
var models_path = __dirname + config.MODELS_PATH;
fs.readdirSync(models_path).forEach(function (file) {
	require(models_path + "/" + file);
});

/* Bootstrap Passport */
require("./config/passport.js")(passport);

var app = express();

/* Configure express settings */
require("./config/express.js")(app, config, passport);


