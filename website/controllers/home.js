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

/* Right now, I am returning random locations. Change to read tracking locations from DB and write to Response */
exports.getLocations = function(req, res){
    var timestamp = new Date();

    var locations = [[33.77572,-84.39603], [33.77508,-84.40041], [33.77979,-84.40135], [33.77993,-84.40907], [33.77294,-84.39903],
    [33.77615,-84.39611], [33.77522,-84.38779], [33.78043,-84.38753], [33.78421,-84.38221]];

    var location = {
    	"timestamp":timestamp, 
    	"locations":[locations[Math.floor((Math.random() * locations.length))]]
    };

    res.send(location);
};