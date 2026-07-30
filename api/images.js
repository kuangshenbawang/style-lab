/* ============================================
   STYLE LAB — 图片代理 API (Vercel Serverless)
   隐藏 Unsplash / Pexels API key，前端不暴露
   部署后将 Vercel 环境变量设为:
     UNSPLASH_ACCESS_KEY=xxx
     PEXELS_API_KEY=xxx
   ============================================ */

module.exports = async (req, res) => {
  // CORS（前端在 GitHub Pages，跨域调用）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  var query = (req.query && req.query.q) || 'fashion outfit';
  var count = Math.min(parseInt(req.query && req.query.count, 10) || 6, 12);
  var source = (req.query && req.query.source) || 'auto';

  var unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
  var pexelsKey = process.env.PEXELS_API_KEY;

  // auto 模式：优先 unsplash，失败转 pexels
  if (source === 'auto') {
    if (unsplashKey) {
      try {
        var r = await fetchUnsplash(query, count, unsplashKey);
        return res.status(200).json({ images: r, source: 'Unsplash' });
      } catch (e) { /* 落到 pexels */ }
    }
    if (pexelsKey) {
      try {
        var r2 = await fetchPexels(query, count, pexelsKey);
        return res.status(200).json({ images: r2, source: 'Pexels' });
      } catch (e) { /* 落到错误 */ }
    }
    return res.status(200).json({ images: [], source: '', error: 'no_api_key' });
  }

  if (source === 'unsplash' && unsplashKey) {
    try {
      var r3 = await fetchUnsplash(query, count, unsplashKey);
      return res.status(200).json({ images: r3, source: 'Unsplash' });
    } catch (e) {
      return res.status(200).json({ images: [], source: '', error: String(e.message || e) });
    }
  }

  if (source === 'pexels' && pexelsKey) {
    try {
      var r4 = await fetchPexels(query, count, pexelsKey);
      return res.status(200).json({ images: r4, source: 'Pexels' });
    } catch (e) {
      return res.status(200).json({ images: [], source: '', error: String(e.message || e) });
    }
  }

  return res.status(200).json({ images: [], source: '', error: 'invalid_source_or_no_key' });
};

/* ===== Unsplash ===== */
async function fetchUnsplash(query, count, key) {
  var url = 'https://api.unsplash.com/search/photos?query=' + encodeURIComponent(query) +
    '&per_page=' + count + '&orientation=portrait&content_filter=high';
  var resp = await fetch(url, {
    headers: { 'Authorization': 'Client-ID ' + key }
  });
  if (!resp.ok) throw new Error('unsplash ' + resp.status);
  var data = await resp.json();
  return (data.results || []).map(function (p) {
    return {
      url: p.urls && p.urls.regular,
      alt: p.alt_description || (p.description || '穿搭参考'),
      credit: p.user && p.user.name,
      link: p.links && p.links.html
    };
  });
}

/* ===== Pexels ===== */
async function fetchPexels(query, count, key) {
  var url = 'https://api.pexels.com/v1/search?query=' + encodeURIComponent(query) +
    '&per_page=' + count + '&orientation=portrait';
  var resp = await fetch(url, {
    headers: { 'Authorization': key }
  });
  if (!resp.ok) throw new Error('pexels ' + resp.status);
  var data = await resp.json();
  return (data.photos || []).map(function (p) {
    return {
      url: p.src && p.src.large,
      alt: p.alt || '穿搭参考',
      credit: p.photographer,
      link: p.url
    };
  });
}
