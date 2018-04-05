//import dependency
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CustomerSchema = new Schema({
    name: String,
    email: String,
    age: Number
});

module.exports = mongoose.model('Customer', CustomerSchema);