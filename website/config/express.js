var express = require("express");
var mongoStore = require("connect-mongo")(express);

module.exports = function (app, config, passport) {

  app.use(express.static(config.ROOT_PATH + "/public"));

  app.configure(function(){

    /* cookieParser should be above session */
    app.use(express.cookieParser());

    /* bodyParser should be above methodOverride */
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    app.use(express.session({
      secret: "secret",
      store: new mongoStore({
          url: config.DATABASE_URL,
          collection : "ers_sessions"
        })
    }));

    /* use passport session */
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(app.router);
  });
};