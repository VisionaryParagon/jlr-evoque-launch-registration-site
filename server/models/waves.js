const mongoose = require('mongoose');

const WaveSchema = new mongoose.Schema({
  wave: String,
  seats: Number,
  rooms: Number
});

module.exports = mongoose.model('waves', WaveSchema);
