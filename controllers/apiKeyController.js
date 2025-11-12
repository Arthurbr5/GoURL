const User = require('../models/User');

// Gerar API Key
exports.generateApiKey = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Verificar se plano permite API
    if (!user.features.api) {
      return res.status(403).json({ 
        error: 'API disponível apenas nos planos Business e Enterprise',
        upgrade: 'https://gourl-w4hh.onrender.com/pricing'
      });
    }

    // Gerar nova API key
    const apiKey = user.generateApiKey();
    await user.save();

    res.json({
      success: true,
      data: {
        apiKey,
        requestsLimit: user.apiRequestsLimit,
        documentation: `${process.env.BASE_URL || 'https://gourl-w4hh.onrender.com'}/api-docs`
      }
    });

  } catch (error) {
    console.error('Erro ao gerar API key:', error);
    res.status(500).json({ error: 'Erro ao gerar API key' });
  }
};

// Obter informações da API Key
exports.getApiKeyInfo = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('apiKey apiRequests apiRequestsLimit features plan');

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({
      success: true,
      data: {
        apiKey: user.apiKey || null,
        requests: user.apiRequests,
        requestsLimit: user.apiRequestsLimit,
        hasAccess: user.features.api,
        plan: user.plan
      }
    });

  } catch (error) {
    console.error('Erro ao obter info da API:', error);
    res.status(500).json({ error: 'Erro ao obter informações da API' });
  }
};

// Revogar API Key
exports.revokeApiKey = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    user.apiKey = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'API Key revogada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao revogar API key:', error);
    res.status(500).json({ error: 'Erro ao revogar API key' });
  }
};
