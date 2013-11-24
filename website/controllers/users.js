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
			res.send("Registration Error =====> " + err);
			return;
		}

		res.redirect("/login");
	});

};

exports.serveLoginPage = function(req, res){
	res.sendfile("/login.html", {root: "./public/"});
};

exports.login = function(req, res){
	var email = req.param("email", null);
	var password = req.param("password", null);

	if(!email || !password){
		res.send("Email and Password cannot be empty");
		return;
	}
	
	User.findOne({
		email: email
	}, function(err, user) {
		if (err) {
			throw err;
		}
		if (user) {
			if(user.authenticate(password)){
				/* set session email for the session. Used for authentication. */
				req.session.email = email; 
				res.redirect('/home');
			}else{
				res.redirect('/login');
			}
		} else {
			res.redirect('/login');
		}
	});
};

exports.logout = function(req, res){
	req.session.destroy();
	res.status(302).redirect("/login");
};

