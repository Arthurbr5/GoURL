const Url = require('../models/Url');
const QRCode = require('qrcode');

// Gerar QR Code para link encurtado
exports.generateQRCode = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const { size = 300, format = 'png' } = req.query;

    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({ error: 'Link não encontrado' });
    }

    // Verificar se é dono do link (se autenticado)
    if (req.userId && url.userId && url.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Sem permissão para acessar este link' });
    }

    const baseUrl = process.env.BASE_URL || 'https://gourl-w4hh.onrender.com';
    const shortUrl = `${baseUrl}/${shortCode}`;

    const options = {
      width: parseInt(size),
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    };

    if (format === 'svg') {
      const qrSvg = await QRCode.toString(shortUrl, { ...options, type: 'svg' });
      res.setHeader('Content-Type', 'image/svg+xml');
      return res.send(qrSvg);
    }

    // PNG (padrão)
    const qrBuffer = await QRCode.toBuffer(shortUrl, options);
    res.setHeader('Content-Type', 'image/png');
    res.send(qrBuffer);

  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
    res.status(500).json({ error: 'Erro ao gerar QR Code' });
  }
};

// Gerar QR Code em base64 (para JSON response)
exports.generateQRCodeBase64 = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const { size = 300 } = req.query;

    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({ error: 'Link não encontrado' });
    }

    const baseUrl = process.env.BASE_URL || 'https://gourl-w4hh.onrender.com';
    const shortUrl = `${baseUrl}/${shortCode}`;

    const qrDataURL = await QRCode.toDataURL(shortUrl, {
      width: parseInt(size),
      margin: 2
    });

    res.json({
      success: true,
      data: {
        shortCode,
        shortUrl,
        qrCode: qrDataURL
      }
    });

  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
    res.status(500).json({ error: 'Erro ao gerar QR Code' });
  }
};

// Gerar QR Code customizado (cores personalizadas - Premium)
exports.generateCustomQRCode = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const { size = 300, darkColor = '#000000', lightColor = '#ffffff' } = req.body;

    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({ error: 'Link não encontrado' });
    }

    // Verificar se usuário é premium
    if (req.userId) {
      const User = require('../models/User');
      const user = await User.findById(req.userId);
      if (!user || (user.plan !== 'premium' && user.plan !== 'business')) {
        return res.status(403).json({ error: 'QR Code customizado é exclusivo do plano Premium' });
      }
    }

    const baseUrl = process.env.BASE_URL || 'https://gourl-w4hh.onrender.com';
    const shortUrl = `${baseUrl}/${shortCode}`;

    const qrDataURL = await QRCode.toDataURL(shortUrl, {
      width: parseInt(size),
      margin: 2,
      color: {
        dark: darkColor,
        light: lightColor
      }
    });

    res.json({
      success: true,
      data: {
        shortCode,
        shortUrl,
        qrCode: qrDataURL
      }
    });

  } catch (error) {
    console.error('Erro ao gerar QR Code customizado:', error);
    res.status(500).json({ error: 'Erro ao gerar QR Code customizado' });
  }
};
