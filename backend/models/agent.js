const mongoose = require('mongoose');

const agentSchema = mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  commissionPercentage: { 
    type: Number, 
    required: true,
    min: 0,
    max: 100,
    validate: {
      validator: function(v) {
        return v >= 0 && v <= 100;
      },
      message: 'Commission percentage must be between 0 and 100'
    }
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

agentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

agentSchema.virtual('totalDealValue').get(function() {
  return this._totalDealValue || 0;
});

agentSchema.virtual('totalEarned').get(function() {
  return (this.totalDealValue * this.commissionPercentage) / 100;
});

agentSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Agent', agentSchema);