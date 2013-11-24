exports.index = function(req, res){
	res.sendfile("home.html", {
    	root: "./public/"
  	});
};