var mongoose = require("mongoose");
var Schema = mongoose.Schema;

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
    }
});

module.exports = mongoose.model("UserInfo", UserSchema);