const BioLink = require('../models/BioLink');
const User = require('../models/User');

// Criar Bio Link
exports.createBioLink = async (req, res) => {
  try {
    const { username, displayName, bio, avatar, theme, links, socialMedia } = req.body;
    const userId = req.userId;

    // Verificar se username já existe
    const existing = await BioLink.findOne({ username: username.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'Username já está em uso' });
    }

    // Verificar se usuário já tem bio link
    const userBioLink = await BioLink.findOne({ userId });
    if (userBioLink) {
      return res.status(400).json({ error: 'Você já possui um Bio Link. Use PUT para atualizar.' });
    }

    // Verificar plano do usuário
    const user = await User.findById(userId);
    const isPremium = user && (user.plan === 'premium' || user.plan === 'business');

    const bioLink = new BioLink({
      userId,
      username: username.toLowerCase(),
      displayName,
      bio: bio || '',
      avatar: avatar || '',
      theme: theme || {},
      links: links || [],
      socialMedia: socialMedia || {},
      isPremium
    });

    await bioLink.save();

    res.status(201).json({
      success: true,
      data: bioLink,
      url: `${process.env.BASE_URL || 'https://gourl-w4hh.onrender.com'}/@${bioLink.username}`
    });

  } catch (error) {
    console.error('Erro ao criar Bio Link:', error);
    res.status(500).json({ error: 'Erro ao criar Bio Link' });
  }
};

// Obter Bio Link público
exports.getBioLink = async (req, res) => {
  try {
    const { username } = req.params;

    const bioLink = await BioLink.findOne({ 
      username: username.toLowerCase(),
      isActive: true 
    }).populate('userId', 'email');

    if (!bioLink) {
      return res.status(404).json({ error: 'Bio Link não encontrado' });
    }

    // Incrementar views
    bioLink.analytics.views += 1;
    await bioLink.save();

    // Retornar apenas dados públicos
    const publicData = {
      username: bioLink.username,
      displayName: bioLink.displayName,
      bio: bioLink.bio,
      avatar: bioLink.avatar,
      theme: bioLink.theme,
      links: bioLink.links.filter(link => link.active),
      socialMedia: bioLink.socialMedia,
      seo: bioLink.seo
    };

    // Se for premium, incluir CSS customizado
    if (bioLink.isPremium && bioLink.customCSS) {
      publicData.customCSS = bioLink.customCSS;
    }

    res.json({ success: true, data: publicData });

  } catch (error) {
    console.error('Erro ao obter Bio Link:', error);
    res.status(500).json({ error: 'Erro ao obter Bio Link' });
  }
};

// Obter Bio Link do usuário autenticado
exports.getMyBioLink = async (req, res) => {
  try {
    const bioLink = await BioLink.findOne({ userId: req.userId });

    if (!bioLink) {
      return res.status(404).json({ error: 'Você ainda não criou um Bio Link' });
    }

    res.json({ success: true, data: bioLink });

  } catch (error) {
    console.error('Erro ao obter Bio Link:', error);
    res.status(500).json({ error: 'Erro ao obter Bio Link' });
  }
};

// Atualizar Bio Link
exports.updateBioLink = async (req, res) => {
  try {
    const updates = req.body;
    const userId = req.userId;

    const bioLink = await BioLink.findOne({ userId });

    if (!bioLink) {
      return res.status(404).json({ error: 'Bio Link não encontrado' });
    }

    // Verificar se está tentando mudar username
    if (updates.username && updates.username !== bioLink.username) {
      const existing = await BioLink.findOne({ username: updates.username.toLowerCase() });
      if (existing) {
        return res.status(409).json({ error: 'Username já está em uso' });
      }
    }

    // Verificar recursos premium
    const user = await User.findById(userId);
    const isPremium = user && (user.plan === 'premium' || user.plan === 'business');

    if (updates.customCSS && !isPremium) {
      return res.status(403).json({ error: 'CSS customizado é exclusivo do plano Premium' });
    }

    // Atualizar campos permitidos
    const allowedUpdates = ['displayName', 'bio', 'avatar', 'theme', 'links', 'socialMedia', 'seo', 'customCSS', 'username'];
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        bioLink[field] = updates[field];
      }
    });

    bioLink.isPremium = isPremium;
    await bioLink.save();

    res.json({ success: true, data: bioLink });

  } catch (error) {
    console.error('Erro ao atualizar Bio Link:', error);
    res.status(500).json({ error: 'Erro ao atualizar Bio Link' });
  }
};

// Registrar clique em link
exports.trackLinkClick = async (req, res) => {
  try {
    const { username, linkIndex } = req.body;

    const bioLink = await BioLink.findOne({ username: username.toLowerCase() });

    if (!bioLink) {
      return res.status(404).json({ error: 'Bio Link não encontrado' });
    }

    bioLink.analytics.clicks += 1;
    await bioLink.save();

    res.json({ success: true });

  } catch (error) {
    console.error('Erro ao rastrear clique:', error);
    res.status(500).json({ error: 'Erro ao rastrear clique' });
  }
};

// Deletar Bio Link
exports.deleteBioLink = async (req, res) => {
  try {
    const result = await BioLink.findOneAndDelete({ userId: req.userId });

    if (!result) {
      return res.status(404).json({ error: 'Bio Link não encontrado' });
    }

    res.json({ success: true, message: 'Bio Link deletado com sucesso' });

  } catch (error) {
    console.error('Erro ao deletar Bio Link:', error);
    res.status(500).json({ error: 'Erro ao deletar Bio Link' });
  }
};
