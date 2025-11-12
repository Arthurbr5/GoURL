const express = require('express');
const router = express.Router();
const bioLinkController = require('../controllers/bioLinkController');
const { authMiddleware } = require('../middleware/auth');

// Rotas públicas
router.get('/:username', bioLinkController.getBioLink);
router.post('/track-click', bioLinkController.trackLinkClick);

// Rotas autenticadas
router.post('/', authMiddleware, bioLinkController.createBioLink);
router.get('/me/my-biolink', authMiddleware, bioLinkController.getMyBioLink);
router.put('/', authMiddleware, bioLinkController.updateBioLink);
router.delete('/', authMiddleware, bioLinkController.deleteBioLink);

module.exports = router;
