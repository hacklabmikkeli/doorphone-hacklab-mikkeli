const mongoose = require('mongoose');


const logSchema = mongoose.Schema({
  name: String,
  timestamp: String,
});

module.exports = mongoose.model('Log', logSchema);