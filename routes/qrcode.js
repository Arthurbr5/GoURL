const express = require('express');
const router = express.Router();
const qrcodeController = require('../controllers/qrcodeController');
const { optionalAuth, authMiddleware } = require('../middleware/auth');

// Gerar QR Code (PNG/SVG)
router.get('/:shortCode', optionalAuth, qrcodeController.generateQRCode);

// Gerar QR Code (Base64)
router.get('/:shortCode/base64', optionalAuth, qrcodeController.generateQRCodeBase64);

// Gerar QR Code customizado (Premium)
router.post('/:shortCode/custom', authMiddleware, qrcodeController.generateCustomQRCode);

module.exports = router;
