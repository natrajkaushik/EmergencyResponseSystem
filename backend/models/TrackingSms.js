var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TrackingSmsSchema = new Schema({
    mobile: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        required: true
    },
    requestType: {
        type: String
    },
    state: {
        type: String
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    }
});

module.exports = mongoose.model("TrackingSms", TrackingSmsSchema);