const mongoose = require('mongoose');

const RetailerSchema = new mongoose.Schema({
  retailer: String,
  hotel: Boolean,
  seats: Number,
  rooms: Number,
  retailer_code: String,
  region: String,
  market: String,
  waves: Array
});

module.exports = mongoose.model('retailers', RetailerSchema);
