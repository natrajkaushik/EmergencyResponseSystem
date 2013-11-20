var request = require("request");

var ReverseGeoCode = {
	REVERSE_GEO_CODE_URL : "http://maps.googleapis.com/maps/api/geocode/json",

	/**
	 * @param point the co-ordinates of the point on earth
	 * @return A human readable address
	 */
	getAddress: function(point, callback){
		var url = this.REVERSE_GEO_CODE_URL + "?" + "latlng=" + point.latitude + "," + point.longitude + "&" + "sensor=false";

		request(url, function (error, response, body) {
  			if (!error && response.statusCode == 200) {
    			var data = JSON.parse(body);
    			callback(data.results[0].formatted_address);
  			}
		});
	}
};

(function main(){
	ReverseGeoCode.getAddress({
		latitude: 33.75,
		longitude: -84.40
	}, function(address){
		console.log(address);
	})
})();

module.exports = ReverseGeoCode;