const mongoose = require('mongoose');


const logSchema = mongoose.Schema({
  name: String,
  timestamp: String,
  access:Boolean
});

module.exports = mongoose.model('Log', logSchema);