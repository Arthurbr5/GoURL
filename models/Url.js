const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  ip: String,
  userAgent: String,
  referer: String,
  country: String,
  city: String,
  device: String,
  browser: String,
  os: String
});

const urlSchema = new mongoose.Schema({
  shortCode: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  originalUrl: {
    type: String,
    required: true
  },
  customAlias: {
    type: String,
    unique: true,
    sparse: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Permite links anônimos
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  clicks: {
    type: Number,
    default: 0
  },
  clicksData: [clickSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    default: null
  },
  password: {
    type: String,
    default: null // Link protegido por senha (opcional)
  },
  tags: [{
    type: String
  }],
  utmParams: {
    source: String,
    medium: String,
    campaign: String,
    term: String,
    content: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  lastClickedAt: {
    type: Date,
    default: null
  }
});

// Índices para performance
urlSchema.index({ userId: 1, createdAt: -1 });
urlSchema.index({ shortCode: 1 });
urlSchema.index({ customAlias: 1 });

// Método para incrementar cliques
urlSchema.methods.recordClick = async function(clickData) {
  this.clicks += 1;
  this.lastClickedAt = new Date();
  
  // Adicionar dados do clique (limitar a 1000 últimos cliques)
  if (this.clicksData.length >= 1000) {
    this.clicksData.shift(); // Remove o mais antigo
  }
  this.clicksData.push(clickData);
  
  await this.save();
};

module.exports = mongoose.model('Url', urlSchema);
