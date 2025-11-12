const User = require('../models/User');
const mercadopago = require('mercadopago');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Configurar Mercado Pago
if (process.env.MERCADOPAGO_ACCESS_TOKEN) {
  mercadopago.configure({
    access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
  });
}

// Planos disponíveis
const PLANS = {
  pro: {
    name: 'Pro',
    price: 29,
    features: {
      bioLink: true,
      qrCode: true,
      customQRCode: true,
      pixels: false,
      api: false,
      passwordProtected: false,
      customDomain: false
    },
    monthlyLinksLimit: 500,
    apiRequestsLimit: 0
  },
  business: {
    name: 'Business',
    price: 79,
    features: {
      bioLink: true,
      qrCode: true,
      customQRCode: true,
      pixels: true,
      api: true,
      passwordProtected: true,
      customDomain: false
    },
    monthlyLinksLimit: 2000,
    apiRequestsLimit: 10000
  },
  enterprise: {
    name: 'Enterprise',
    price: 199,
    features: {
      bioLink: true,
      qrCode: true,
      customQRCode: true,
      pixels: true,
      api: true,
      passwordProtected: true,
      customDomain: true
    },
    monthlyLinksLimit: -1, // ilimitado
    apiRequestsLimit: -1
  }
};

// Criar checkout Mercado Pago (PIX, boleto, cartão BR)
exports.createMercadoPagoCheckout = async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.userId;

    if (!PLANS[plan]) {
      return res.status(400).json({ error: 'Plano inválido' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const planData = PLANS[plan];
    const baseUrl = process.env.BASE_URL || 'https://gourl-w4hh.onrender.com';

    // Criar preferência de pagamento
    const preference = {
      items: [
        {
          title: `GoURL ${planData.name} - Assinatura Mensal`,
          unit_price: planData.price,
          quantity: 1,
        }
      ],
      payer: {
        email: user.email,
        name: user.username
      },
      back_urls: {
        success: `${baseUrl}/payment-success?plan=${plan}`,
        failure: `${baseUrl}/payment-failure`,
        pending: `${baseUrl}/payment-pending`
      },
      auto_return: 'approved',
      external_reference: `${userId}_${plan}_${Date.now()}`,
      notification_url: `${baseUrl}/api/payments/mercadopago-webhook`,
      statement_descriptor: 'GoURL'
    };

    const response = await mercadopago.preferences.create(preference);

    res.json({
      success: true,
      data: {
        checkoutUrl: response.body.init_point,
        preferenceId: response.body.id
      }
    });

  } catch (error) {
    console.error('Erro ao criar checkout Mercado Pago:', error);
    res.status(500).json({ error: 'Erro ao criar checkout' });
  }
};

// Criar checkout Stripe (cartões internacionais)
exports.createStripeCheckout = async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.userId;

    if (!PLANS[plan]) {
      return res.status(400).json({ error: 'Plano inválido' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const planData = PLANS[plan];
    const baseUrl = process.env.BASE_URL || 'https://gourl-w4hh.onrender.com';

    // Criar sessão de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: `GoURL ${planData.name}`,
              description: 'Assinatura Mensal'
            },
            unit_amount: planData.price * 100, // centavos
            recurring: {
              interval: 'month'
            }
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer_email: user.email,
      client_reference_id: userId.toString(),
      metadata: {
        userId: userId.toString(),
        plan: plan
      },
      success_url: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancel_url: `${baseUrl}/pricing`
    });

    res.json({
      success: true,
      data: {
        checkoutUrl: session.url,
        sessionId: session.id
      }
    });

  } catch (error) {
    console.error('Erro ao criar checkout Stripe:', error);
    res.status(500).json({ error: 'Erro ao criar checkout' });
  }
};

// Webhook Mercado Pago
exports.mercadoPagoWebhook = async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === 'payment') {
      const paymentId = data.id;
      const payment = await mercadopago.payment.findById(paymentId);
      
      if (payment.body.status === 'approved') {
        const [userId, plan] = payment.body.external_reference.split('_');
        await activatePlan(userId, plan);
      }
    }

    res.sendStatus(200);

  } catch (error) {
    console.error('Erro no webhook Mercado Pago:', error);
    res.sendStatus(500);
  }
};

// Webhook Stripe
exports.stripeWebhook = async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.metadata.userId;
      const plan = session.metadata.plan;
      
      await activatePlan(userId, plan);
    }

    res.sendStatus(200);

  } catch (error) {
    console.error('Erro no webhook Stripe:', error);
    res.sendStatus(400);
  }
};

// Ativar plano do usuário
async function activatePlan(userId, planKey) {
  try {
    const planData = PLANS[planKey];
    if (!planData) return;

    const user = await User.findById(userId);
    if (!user) return;

    // Atualizar plano
    user.plan = planKey;
    user.planExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 dias
    user.features = planData.features;
    user.monthlyLinksLimit = planData.monthlyLinksLimit;
    user.apiRequestsLimit = planData.apiRequestsLimit;

    await user.save();

    console.log(`✅ Plano ${planKey} ativado para usuário ${userId}`);

  } catch (error) {
    console.error('Erro ao ativar plano:', error);
  }
}

// Cancelar assinatura
exports.cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Resetar para plano free
    user.plan = 'free';
    user.features = {
      bioLink: false,
      qrCode: true,
      customQRCode: false,
      pixels: false,
      api: false,
      customDomain: false,
      analytics: true,
      passwordProtected: false
    };
    user.monthlyLinksLimit = 100;
    user.apiRequestsLimit = 0;

    await user.save();

    res.json({
      success: true,
      message: 'Assinatura cancelada. Você voltou para o plano Free.'
    });

  } catch (error) {
    console.error('Erro ao cancelar assinatura:', error);
    res.status(500).json({ error: 'Erro ao cancelar assinatura' });
  }
};

// Obter status da assinatura
exports.getSubscriptionStatus = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('plan planExpiry features');

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const isActive = user.planExpiry && user.planExpiry > new Date();

    res.json({
      success: true,
      data: {
        plan: user.plan,
        planExpiry: user.planExpiry,
        isActive,
        features: user.features,
        daysRemaining: isActive ? Math.ceil((user.planExpiry - new Date()) / (1000 * 60 * 60 * 24)) : 0
      }
    });

  } catch (error) {
    console.error('Erro ao obter status:', error);
    res.status(500).json({ error: 'Erro ao obter status da assinatura' });
  }
};
