const express = require('express');
const router = express.Router();
const apiKeyController = require('../controllers/apiKeyController');
const { authMiddleware } = require('../middleware/auth');

// Gerar nova API key
router.post('/generate', authMiddleware, apiKeyController.generateApiKey);

// Obter informações da API key
router.get('/info', authMiddleware, apiKeyController.getApiKeyInfo);

// Revogar API key
router.delete('/revoke', authMiddleware, apiKeyController.revokeApiKey);

module.exports = router;
