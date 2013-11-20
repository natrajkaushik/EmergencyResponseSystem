var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var crypto = require("crypto");
var _ = require("underscore");

var UserSchema = new Schema({
    mobile: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index:{
          unique: true
        }
    },
    password: {
        type: String,
        required: true
    },
    hashed_password: {
      type: String,
      required: true
    },
    salt: {
      type: String,
      required: true
    }
});


UserSchema.virtual("password'").set(function(password) {
  this._password = password;
  this.salt = this.makeSalt();
  this.hashed_password = this.encryptPassword(password);
}).get(function() { 
  return this._password; });


var validate = function (value) {
  return (value && value.length);
};


/* pre-save hook */
UserSchema.pre("save", function(next) {
  if (!this.isNew) {
    return next();
  }

  if (!validate(this.password)){
    next(new Error("Invalid password"));
  }
  else{
    next();
  }
});


UserSchema.methods = {

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */

  authenticate: function(plainText) {
    return (this.encryptPassword(plainText) === this.hashed_password);
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */

  makeSalt: function() {
    return Math.round((new Date().valueOf() * Math.random())) + "";
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */

  encryptPassword: function(password) {
    if (!password) {
      return "";
    }
    return crypto.createHmac("sha1", this.salt).update(password).digest("hex");
  }
}

mongoose.model('User', UserSchema)