module.exports = function (app, passport) {

  /***  User routes ***/
  var users = require("../controllers/users.js");
  
  app.get("/register", users.serveRegisterPage);
  app.post("/register", users.register);
  
  app.get("/login", users.serveLoginPage);
  app.post("/login", users.login);

  //app.get("/logout", users.logout);
  //app.post("/users", users.create);
  //app.post("/users/session", passport.authenticate("local", 
    //{
      //failureRedirect: "/login"
    //}), users.session);
  //app.get("/users/:userId", users.show);

  
  /*** Home ***/
  var home = require("../controllers/home.js");
  app.get("/", home.index);
  app.get("/home", home.index);
};