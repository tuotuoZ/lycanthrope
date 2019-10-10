var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var role = new Schema({
    userRole: String,
    userSide: String
  }, {collection: 'roles'}
);

module.exports = mongoose.model('Role', role);
