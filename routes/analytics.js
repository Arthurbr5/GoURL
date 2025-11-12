const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authMiddleware, optionalAuth } = require('../middleware/auth');

// Obter analytics de um link específico
router.get('/:shortCode', optionalAuth, analyticsController.getUrlAnalytics);

// Obter estatísticas gerais do usuário (requer autenticação)
router.get('/user/stats', authMiddleware, analyticsController.getUserStats);

module.exports = router;
