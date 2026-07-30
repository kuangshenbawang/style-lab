/* ============================================
   STYLE LAB — 图片二进制代理 (Vercel Serverless)
   解决中国大陆无法直连 images.unsplash.com /
   images.pexels.com 的问题：用户浏览器只访问
   Vercel 域名，由服务端去图床拉取图片后转发。
   ============================================ */

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(204).end();

  var target = req.query && req.query.url;
  if (!target) return res.status(400).end('missing url');

  // 只允许白名单图床域名，防止被当作开放代理滥用
  var allowed = ['images.unsplash.com', 'images.pexels.com', 'plus.unsplash.com'];
  var u;
  try {
    u = new URL(target);
  } catch (e) {
    return res.status(400).end('bad url');
  }
  if (allowed.indexOf(u.hostname) === -1) {
    return res.status(403).end('domain not allowed');
  }

  try {
    var r = await fetch(target);
    if (!r.ok) return res.status(r.status).end('upstream error');
    var buf = Buffer.from(await r.arrayBuffer());
    res.setHeader('Content-Type', r.headers.get('content-type') || 'image/jpeg');
    // 边缘缓存 1 天，减轻图床与函数压力
    res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
    return res.status(200).end(buf);
  } catch (e) {
    return res.status(502).end('fetch failed');
  }
};
