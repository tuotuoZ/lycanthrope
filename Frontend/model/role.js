var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var role = new Schema({
    userID: Number,
    userRole: String,
    userSide: String,
    userStatus: {type: String, default: "live"}
});

module.exports = mongoose.model('Role', role);