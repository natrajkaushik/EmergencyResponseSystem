exports.authenticate = function(req, res, next) {
	var isAuthenticated = false;
	if(req.session.email) {
		isAuthenticated = true;
	}
	if(isAuthenticated) {
		next();
	} else {
		console.log("Authentication error");
		res.redirect('/login');
		}
};

exports.index = function(req, res){
	res.sendfile("home.html", {
    	root: "./public/"
  	});
};