const Url = require('../models/Url');

// Obter analytics de um link específico
exports.getUrlAnalytics = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const userId = req.userId;

    const url = await Url.findOne({ shortCode, isActive: true });

    if (!url) {
      return res.status(404).json({ error: 'Link não encontrado' });
    }

    // Verificar se o usuário é o dono
    if (userId && url.userId && url.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    // Processar dados de cliques
    const clicksByDate = {};
    const clicksByCountry = {};
    const clicksByBrowser = {};
    const clicksByOS = {};
    const clicksByDevice = {};
    const clicksByReferer = {};

    url.clicksData.forEach(click => {
      // Por data
      const date = click.timestamp.toISOString().split('T')[0];
      clicksByDate[date] = (clicksByDate[date] || 0) + 1;

      // Por país
      const country = click.country || 'Unknown';
      clicksByCountry[country] = (clicksByCountry[country] || 0) + 1;

      // Por browser
      const browser = click.browser || 'Unknown';
      clicksByBrowser[browser] = (clicksByBrowser[browser] || 0) + 1;

      // Por OS
      const os = click.os || 'Unknown';
      clicksByOS[os] = (clicksByOS[os] || 0) + 1;

      // Por device
      const device = click.device || 'Unknown';
      clicksByDevice[device] = (clicksByDevice[device] || 0) + 1;

      // Por referer
      const referer = click.referer || 'Direct';
      clicksByReferer[referer] = (clicksByReferer[referer] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        shortCode: url.shortCode,
        shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
        originalUrl: url.originalUrl,
        totalClicks: url.clicks,
        createdAt: url.createdAt,
        lastClickedAt: url.lastClickedAt,
        analytics: {
          clicksByDate: Object.entries(clicksByDate).map(([date, count]) => ({ date, count })),
          clicksByCountry: Object.entries(clicksByCountry).map(([country, count]) => ({ country, count })),
          clicksByBrowser: Object.entries(clicksByBrowser).map(([browser, count]) => ({ browser, count })),
          clicksByOS: Object.entries(clicksByOS).map(([os, count]) => ({ os, count })),
          clicksByDevice: Object.entries(clicksByDevice).map(([device, count]) => ({ device, count })),
          clicksByReferer: Object.entries(clicksByReferer)
            .map(([referer, count]) => ({ referer, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10) // Top 10 referers
        },
        recentClicks: url.clicksData
          .slice(-20) // Últimos 20 cliques
          .reverse()
          .map(click => ({
            timestamp: click.timestamp,
            browser: click.browser,
            os: click.os,
            device: click.device,
            referer: click.referer
          }))
      }
    });

  } catch (error) {
    console.error('Erro ao obter analytics:', error);
    res.status(500).json({ error: 'Erro ao obter analytics' });
  }
};

// Obter estatísticas gerais do usuário
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.userId;

    const urls = await Url.find({ userId, isActive: true });

    const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
    const totalUrls = urls.length;
    
    // URLs mais clicadas
    const topUrls = urls
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10)
      .map(url => ({
        shortCode: url.shortCode,
        shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
        title: url.title || url.originalUrl,
        clicks: url.clicks,
        createdAt: url.createdAt
      }));

    // URLs recentes
    const recentUrls = urls
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5)
      .map(url => ({
        shortCode: url.shortCode,
        shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
        title: url.title || url.originalUrl,
        clicks: url.clicks,
        createdAt: url.createdAt
      }));

    res.json({
      success: true,
      data: {
        totalUrls,
        totalClicks,
        averageClicksPerUrl: totalUrls > 0 ? Math.round(totalClicks / totalUrls) : 0,
        topUrls,
        recentUrls
      }
    });

  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({ error: 'Erro ao obter estatísticas' });
  }
};
