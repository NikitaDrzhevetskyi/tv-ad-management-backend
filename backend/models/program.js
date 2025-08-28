const mongoose = require('mongoose');

const programSchema = mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  costPeerMinute: { type: Number, required: true },
});

module.exports = mongoose.model('Program', programSchema);
