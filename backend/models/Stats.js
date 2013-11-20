var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var StatsSchema = new Schema({
    inTimestamp: {
        type: Date
    },
    outTimestamp: {
        type: Date
    },
    requestType: {
        type: String
    },
    timeTaken: {
        type: Number
    }
});

module.exports = mongoose.model("Stats", StatsSchema);