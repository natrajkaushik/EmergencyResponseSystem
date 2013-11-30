module.exports = function (app, passport) {

  /***  User routes ***/
  var users = require("../controllers/users.js");
  
  app.get("/register", users.serveRegisterPage);
  app.post("/register", users.register);
  
  app.get("/login", users.serveLoginPage);
  app.post("/login", users.login);

  app.post("/logout", users.logout);

  
  /*** Home ***/
  var home = require("../controllers/home.js");
  app.get("/", home.authenticate, home.index);
  app.get("/home", home.authenticate, home.index);

  app.get("/locations", home.getLocations);
};