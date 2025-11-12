const mongoose = require('mongoose');

const linkItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'link'
  },
  active: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
});

const bioLinkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[a-z0-9_-]+$/
  },
  displayName: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    maxlength: 200
  },
  avatar: {
    type: String,
    default: ''
  },
  theme: {
    backgroundColor: { type: String, default: '#ffffff' },
    textColor: { type: String, default: '#000000' },
    buttonColor: { type: String, default: '#000000' },
    buttonTextColor: { type: String, default: '#ffffff' },
    fontFamily: { type: String, default: 'Inter' }
  },
  links: [linkItemSchema],
  socialMedia: {
    instagram: String,
    twitter: String,
    tiktok: String,
    youtube: String,
    facebook: String,
    linkedin: String,
    github: String
  },
  analytics: {
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 }
  },
  seo: {
    title: String,
    description: String,
    image: String
  },
  customCSS: {
    type: String,
    maxlength: 5000
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices
bioLinkSchema.index({ username: 1 });
bioLinkSchema.index({ userId: 1 });

module.exports = mongoose.model('BioLink', bioLinkSchema);
