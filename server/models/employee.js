const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  jlr_id: String,
  first_name: String,
  last_name: String,
  email: String,
  job: String,
  retailer: String,
  region_number: String
});

module.exports = mongoose.model('employees', EmployeeSchema);
