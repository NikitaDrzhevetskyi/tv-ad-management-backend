const mongoose = require('mongoose');

const advertisementSchema = mongoose.Schema({
  program: { type: String, required: true },
  rating: { type: Number, required: true },
  pricePerMinute: { type: Number, required: true },
  duration: { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true },
  date: { type: String, required: true },
  organizationName: { type: String, required: true },
  contactPerson: { type: String, required: true },

  phoneNumber: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\+?[0-9]{7,15}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number`,
    },
  },

  bankDetails: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending',
  },
  
  // NEW: Agent reference
  agentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Agent', 
    required: false // Optional - not all advertisements need to have an agent
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

advertisementSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Advertisement', advertisementSchema);