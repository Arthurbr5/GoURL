const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Pegar token do header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};

// Middleware opcional (permite requisições sem autenticação)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.userId;
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    // Token inválido, mas continua sem autenticação
    next();
  }
};

// Middleware para autenticação via API Key
const apiKeyAuth = async (req, res, next) => {
  try {
    const apiKey = req.header('X-API-Key');

    if (!apiKey) {
      return res.status(401).json({ 
        error: 'API Key não fornecida',
        hint: 'Adicione o header: X-API-Key: sua_chave_aqui'
      });
    }

    // Buscar usuário pela API key
    const user = await User.findOne({ apiKey });

    if (!user) {
      return res.status(401).json({ error: 'API Key inválida' });
    }

    // Verificar se tem acesso à API
    if (!user.features.api) {
      return res.status(403).json({ error: 'Sem permissão para usar a API' });
    }

    // Verificar limite de requisições
    if (user.apiRequestsLimit > 0 && user.apiRequests >= user.apiRequestsLimit) {
      return res.status(429).json({ 
        error: 'Limite de requisições atingido',
        limit: user.apiRequestsLimit,
        used: user.apiRequests
      });
    }

    // Incrementar contador de requisições
    user.apiRequests += 1;
    await user.save();

    req.userId = user._id;
    req.user = user;
    
    next();
  } catch (error) {
    console.error('Erro na autenticação API:', error);
    res.status(500).json({ error: 'Erro na autenticação' });
  }
};

module.exports = { authMiddleware, optionalAuth, apiKeyAuth };
