var Config = require("./config.js");

/**
 * Contains methods to contact the appropriate Police (GT or Atlanta) or other Help agencies
 */

var PoliceContactHelper = {
	GT_CAMPUS_RADIUS : 0.6295848592841651,
	EARTH_RADIUS: 3958.75,
        
    // origin: on Atlantic Drive, near CoC building which we are taking to be the center of the campus
    origin: {
    	GTCENTER_LAT : 33.7771,
    	GTCENTER_LON : -84.3978
    },

    /**
     * @param point1
     * @param point2
     * @return the actual distance on earth between two points represented by their latitude and longitude
     */
    getEarthDistance: function(point1, point2){
    	var toRad = function(number){
    		return number * Math.PI/180;
    	}

        var latDiff = toRad(point2.latitude - point1.latitude);
        var longDiff = toRad(point2.longitude-point2.longitude);
        var sindLat = Math.sin(latDiff / 2);
        var sindLng = Math.sin(longDiff / 2);
        var a = Math.pow(sindLat, 2) + Math.pow(sindLng, 2) * Math.cos(toRad(point1.latitude)) * Math.cos(toRad(point2.latitude));
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var dist = EARTH_RADIUS * c;

        return dist;
    },

    /**
     * returns true if the point is within the Georgia Tech Campus
     */
    insideGeorgiaTech: function(point){
    	return this.getEarthDistance(this.origin.GTCENTER_LAT, this.origin.GTCENTER_LON, point.latitude, point.longitude) <= this.origin.GT_CAMPUS_RADIUS;
    },
           
    getPoliceNumber: function(point){
    	insideGeorgiaTech(point) ? Config.POLICE_NUMBER_WITHIN : Config.POLICE_NUMBER_WITHOUT;
    }  
       
        
};

module.exports = PoliceContactHelper;