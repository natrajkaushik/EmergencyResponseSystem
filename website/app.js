var express = require("express");
var mongoose = require("mongoose");
var config = require("./config/config.js");
var passport = require("passport");
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
console.log(config.ROOT_PATH);
require("./config/express.js")(app, config, passport);

/* Bootstrap routes */
require("./config/routes.js")(app, passport);

app.listen(config.PORT);
console.log("Emergency Response System web server started on port ====> "+ config.PORT);


