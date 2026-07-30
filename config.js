/* ============================================
   STYLE LAB — 全局配置
   部署时只需改这一处
   ============================================ */

window.STYLE_LAB_CONFIG = {
  // 图片代理 API 地址
  // 已部署到 Vercel：https://style-lab-mocha.vercel.app
  imageProxy: 'https://style-lab-mocha.vercel.app/api/images',

  // 图片源: 'unsplash' | 'pexels' | 'auto'
  // auto = 两个源轮流用，任一失败自动切另一个
  imageSource: 'auto',

  // 每次加载图片数量（瀑布流）
  imageCount: 6,

  // 图片代理请求超时（毫秒）
  imageTimeout: 8000,

  // 趋势数据 JSON 路径
  trendsUrl: './data/trends.json'
};
