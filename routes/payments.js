const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authMiddleware } = require('../middleware/auth');

// Criar checkout (autenticado)
router.post('/mercadopago/create-checkout', authMiddleware, paymentController.createMercadoPagoCheckout);
router.post('/stripe/create-checkout', authMiddleware, paymentController.createStripeCheckout);

// Webhooks (públicos - validados por assinatura)
router.post('/mercadopago-webhook', express.raw({ type: 'application/json' }), paymentController.mercadoPagoWebhook);
router.post('/stripe-webhook', express.raw({ type: 'application/json' }), paymentController.stripeWebhook);

// Gerenciar assinatura (autenticado)
router.get('/subscription-status', authMiddleware, paymentController.getSubscriptionStatus);
router.post('/cancel-subscription', authMiddleware, paymentController.cancelSubscription);

module.exports = router;
