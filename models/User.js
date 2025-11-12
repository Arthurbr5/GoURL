const mongoose = require('mongoose');

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
    enum: ['free', 'premium', 'business'],
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
