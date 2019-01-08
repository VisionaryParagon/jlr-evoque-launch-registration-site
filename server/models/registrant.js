const mongoose = require('mongoose');

const RegSchema = new mongoose.Schema({
  jlr_id: String,
  first_name: String,
  last_name: String,
  email: String,
  job: String,
  retailer: String,
  retailer_code: String,
  region_number: String,
  region: String,
  market: String,
  hotel: Boolean,
  seats: Number,
  rooms: Number,
  wave: String,
  diet: String,
  special: String,
  created: {
    type: Date,
    default: Date.now
  },
  modified: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('registrants', RegSchema);
