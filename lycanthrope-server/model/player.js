var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var player = new Schema({
    userID: Number,
    userRole: String,
    userSide: String,
    userStatus: {type: String, default: "live"},
    userGuard: {type: Boolean, default: false}
  }, {collection: 'game'}
);

module.exports = mongoose.model('Player', player);
