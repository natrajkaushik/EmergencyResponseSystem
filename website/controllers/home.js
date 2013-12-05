var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TrackingSms = mongoose.model('TrackingSms', new Schema({  mobile: {
        type: String,
    },
    timestamp: {
        type: Date,
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    }}), 
               "trackingsms");

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

exports.getLocations = function(req, res){
	var mobile = req.param("mobile", null);
	var timestamp = req.param("timestamp", null);

	var locations = [];

    TrackingSms.find({
    		mobile: mobile,
    		timestamp: {$gt : timestamp}
    },function(error, data){
    	if(error){
    		console.error(error);
    		return;
    	}else{
    		if(data && data.length){
    			for(var i = 0; i < data.length; i++){
    				locations.push([data[i].latitude, data[i].longitude]);
    			}
    		}
    		res.send({
    			"timestamp":new Date(),
    			"locations"	: locations
    		})
    	}
    });
};