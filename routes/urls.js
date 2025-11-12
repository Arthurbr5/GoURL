const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');
const { authMiddleware, optionalAuth } = require('../middleware/auth');

// Criar link (autenticação opcional - permite links anônimos)
router.post('/', optionalAuth, urlController.createShortUrl);

// Listar links do usuário (requer autenticação)
router.get('/', authMiddleware, urlController.getUserUrls);

// Obter detalhes de um link
router.get('/:shortCode', optionalAuth, urlController.getUrlDetails);

// Atualizar link (requer autenticação)
router.put('/:shortCode', authMiddleware, urlController.updateUrl);

// Deletar link (requer autenticação)
router.delete('/:shortCode', authMiddleware, urlController.deleteUrl);

module.exports = router;
