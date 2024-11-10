const mongoose = require('mongoose');

// Define the Visit schema
const visitSchema = new mongoose.Schema({
  ipAddress: String,
  userAgent: String,
  timestamp: { type: Date, default: Date.now },
});

// Create the Visit model
const Visit = mongoose.model('Visit', visitSchema);

module.exports = Visit;
