var User = require("../models/user.js");

exports.serveRegisterPage = function (req, res) {
  res.sendfile("/register.html", {root: "./public/"});
};

exports.register = function(req, res, next){
	var firstName = req.param("firstName", "");
	var lastName = req.param("lastName", "");
	var email = req.param("email", "");
	var mobile = req.param("mobile", "");
	var password = req.param("password", "");

	/* Save user to database */
	// TODO First check if the user already exists in DB before saving.
	var user = new User({
		firstName: firstName,
		lastName: lastName,
		email: email,
		mobile: mobile
	});

	user.set("password", password);
	user.save(function(err, result){
		if(err){
			console.error("Could not register =====> " + email);
			console.error(err);
			return;
		}
	});

	res.send(email + " Successfully registered");
};

exports.serveLoginPage = function(req, res){
	res.sendfile("/login.html", {root: "./public/"});
};

