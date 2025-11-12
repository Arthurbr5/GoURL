const Url = require('../models/Url');
const { nanoid } = require('nanoid');
const validator = require('validator');

// Criar link encurtado
exports.createShortUrl = async (req, res) => {
  try {
    const { originalUrl, customAlias, title, description, expiresAt } = req.body;

    // Validar URL
    if (!originalUrl || !validator.isURL(originalUrl)) {
      return res.status(400).json({ error: 'URL inválida' });
    }

    // Verificar se usuário está autenticado
    const userId = req.userId || null;

    // Gerar código curto ou usar alias customizado
    let shortCode;
    if (customAlias) {
      // Validar alias personalizado
      if (!/^[a-zA-Z0-9_-]+$/.test(customAlias)) {
        return res.status(400).json({ error: 'Alias inválido. Use apenas letras, números, _ e -' });
      }

      // Verificar se já existe
      const existing = await Url.findOne({ $or: [{ shortCode: customAlias }, { customAlias }] });
      if (existing) {
        return res.status(409).json({ error: 'Este alias já está em uso' });
      }
      
      shortCode = customAlias;
    } else {
      // Gerar código aleatório único
      do {
        shortCode = nanoid(6);
      } while (await Url.findOne({ shortCode }));
    }

    // Criar URL encurtada (não incluir customAlias se for null)
    const urlData = {
      shortCode,
      originalUrl,
      userId,
      title: title || '',
      description: description || '',
      expiresAt: expiresAt || null
    };

    // Só adicionar customAlias se ele existir (evitar null no banco)
    if (customAlias) {
      urlData.customAlias = customAlias;
    }

    const url = new Url(urlData);
    await url.save();

    // Incrementar contador do usuário
    if (userId) {
      const User = require('../models/User');
      await User.findByIdAndUpdate(userId, { $inc: { linksCreated: 1 } });
    }

    // Gerar URL base (com fallback automático para produção)
    const baseUrl = process.env.BASE_URL || 'https://gourl-w4hh.onrender.com';
    const shortUrl = `${baseUrl}/${shortCode}`;

    res.status(201).json({
      success: true,
      data: {
        shortCode,
        shortUrl,
        originalUrl: url.originalUrl,
        title: url.title,
        createdAt: url.createdAt
      }
    });

  } catch (error) {
    console.error('Erro ao criar URL:', error);
    res.status(500).json({ error: 'Erro ao criar link encurtado' });
  }
};

// Listar URLs do usuário
exports.getUserUrls = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 20, sortBy = 'createdAt', order = 'desc' } = req.query;

    const urls = await Url.find({ userId, isActive: true })
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-clicksData'); // Não retornar dados detalhados de cliques

    const total = await Url.countDocuments({ userId, isActive: true });

    res.json({
      success: true,
      data: urls.map(url => ({
        shortCode: url.shortCode,
        shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
        originalUrl: url.originalUrl,
        title: url.title,
        clicks: url.clicks,
        createdAt: url.createdAt,
        lastClickedAt: url.lastClickedAt
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao listar URLs:', error);
    res.status(500).json({ error: 'Erro ao listar links' });
  }
};

// Obter detalhes de uma URL
exports.getUrlDetails = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const userId = req.userId;

    const url = await Url.findOne({ shortCode, isActive: true });

    if (!url) {
      return res.status(404).json({ error: 'Link não encontrado' });
    }

    // Verificar se o usuário é o dono (se autenticado)
    if (userId && url.userId && url.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    res.json({
      success: true,
      data: {
        shortCode: url.shortCode,
        shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
        originalUrl: url.originalUrl,
        title: url.title,
        description: url.description,
        clicks: url.clicks,
        createdAt: url.createdAt,
        lastClickedAt: url.lastClickedAt,
        expiresAt: url.expiresAt
      }
    });

  } catch (error) {
    console.error('Erro ao obter detalhes:', error);
    res.status(500).json({ error: 'Erro ao obter detalhes do link' });
  }
};

// Deletar URL
exports.deleteUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const userId = req.userId;

    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({ error: 'Link não encontrado' });
    }

    // Verificar se o usuário é o dono
    if (!userId || !url.userId || url.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    // Soft delete (marcar como inativo)
    url.isActive = false;
    await url.save();

    res.json({
      success: true,
      message: 'Link deletado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar URL:', error);
    res.status(500).json({ error: 'Erro ao deletar link' });
  }
};

// Atualizar URL
exports.updateUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const userId = req.userId;
    const { title, description } = req.body;

    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({ error: 'Link não encontrado' });
    }

    // Verificar se o usuário é o dono
    if (!userId || !url.userId || url.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    // Atualizar campos
    if (title !== undefined) url.title = title;
    if (description !== undefined) url.description = description;

    await url.save();

    res.json({
      success: true,
      message: 'Link atualizado com sucesso',
      data: {
        shortCode: url.shortCode,
        title: url.title,
        description: url.description
      }
    });

  } catch (error) {
    console.error('Erro ao atualizar URL:', error);
    res.status(500).json({ error: 'Erro ao atualizar link' });
  }
};
