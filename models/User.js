const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  plan: {
    type: String,
    enum: ['free', 'pro', 'business', 'enterprise'],
    default: 'free'
  },
  planExpiry: {
    type: Date,
    default: null
  },
  linksCreated: {
    type: Number,
    default: 0
  },
  monthlyLinksLimit: {
    type: Number,
    default: 100 // Free plan limit
  },
  apiKey: {
    type: String,
    unique: true,
    sparse: true
  },
  apiRequests: {
    type: Number,
    default: 0
  },
  apiRequestsLimit: {
    type: Number,
    default: 0 // 0 = sem acesso à API
  },
  features: {
    bioLink: { type: Boolean, default: false },
    qrCode: { type: Boolean, default: true },
    customQRCode: { type: Boolean, default: false },
    pixels: { type: Boolean, default: false },
    api: { type: Boolean, default: false },
    customDomain: { type: Boolean, default: false },
    analytics: { type: Boolean, default: true },
    passwordProtected: { type: Boolean, default: false }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Gerar API Key
userSchema.methods.generateApiKey = function() {
  this.apiKey = 'gou_' + crypto.randomBytes(32).toString('hex');
  return this.apiKey;
};

module.exports = mongoose.model('User', userSchema);
