var User = require("../models/user.js");

exports.serveRegisterPage = function (req, res) {
  res.sendfile("/register.html", {root: "./public/"});
};

exports.register = function(req, res){

};

