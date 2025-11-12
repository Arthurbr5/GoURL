const Url = require('../models/Url');

// Função para extrair informações do user agent
const parseUserAgent = (userAgent) => {
  const ua = userAgent || '';
  
  // Detectar browser
  let browser = 'Unknown';
  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Edge')) browser = 'Edge';
  else if (ua.includes('Opera')) browser = 'Opera';
  
  // Detectar OS
  let os = 'Unknown';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'MacOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS')) os = 'iOS';
  
  // Detectar device
  let device = 'Desktop';
  if (ua.includes('Mobile')) device = 'Mobile';
  else if (ua.includes('Tablet')) device = 'Tablet';
  
  return { browser, os, device };
};

module.exports = async (req, res) => {
  try {
    const { shortCode } = req.params;

    // Buscar URL
    const url = await Url.findOne({ shortCode, isActive: true });

    if (!url) {
      return res.status(404).sendFile(require('path').join(__dirname, '../public/404.html'));
    }

    // Verificar se expirou
    if (url.expiresAt && url.expiresAt < new Date()) {
      return res.status(410).json({ error: 'Este link expirou.' });
    }

    // Coletar dados do clique
    const { browser, os, device } = parseUserAgent(req.headers['user-agent']);
    
    const clickData = {
      timestamp: new Date(),
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
      referer: req.headers['referer'] || req.headers['referrer'] || 'Direct',
      browser,
      os,
      device
    };

    // Registrar clique
    await url.recordClick(clickData);

    // Redirecionar
    res.redirect(url.originalUrl);

  } catch (error) {
    console.error('Erro no redirecionamento:', error);
    res.status(500).json({ error: 'Erro ao redirecionar' });
  }
};
