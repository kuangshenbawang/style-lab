/* ============================================
   STYLE LAB — 趋势 RSS 抓取脚本
   由 GitHub Actions 定时调用，生成 data/trends.json
   用法: node scripts/fetch-trends.js
   ============================================ */

const fs = require('fs');
const path = require('path');

// 可配置的时尚 RSS 源（失败自动跳过）
const RSS_SOURCES = [
  'https://www.vogue.com/feed/rss',
  'https://www.gq.com/feed/rss'
];

// 趋势卡片配色（循环使用）
const CARD_BG = [
  'linear-gradient(135deg, #f5f0eb, #e0d5c8)',
  'linear-gradient(135deg, #2d3a2e, #4a6b50)',
  'linear-gradient(135deg, #c4704b, #e8c4a0)',
  'linear-gradient(135deg, #a8d8e8, #e0f0f5)',
  'linear-gradient(135deg, #1a1a2e, #5b6cb0)',
  'linear-gradient(135deg, #3d5a40, #7bab6e)',
  'linear-gradient(135deg, #8b5ca8, #d4a5d8)',
  'linear-gradient(135deg, #9c5836, #c4704b)'
];

const HOT_LABELS = ['TOP 1', 'TOP 2', 'TOP 3', 'HOT', 'HOT', 'NEW'];

async function fetchWithTimeout(url, ms) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const resp = await fetch(url, { signal: ctrl.signal, headers: { 'User-Agent': 'StyleLab-TrendBot/1.0' } });
    return resp;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchRSS(url) {
  try {
    const resp = await fetchWithTimeout(url, 12000);
    if (!resp.ok) {
      console.error('  ✗', url, resp.status);
      return [];
    }
    const xml = await resp.text();
    const items = parseRSS(xml);
    console.error('  ✓', url, '->', items.length, 'items');
    return items;
  } catch (e) {
    console.error('  ✗', url, e.message);
    return [];
  }
}

function extractTag(block, tag) {
  const re = new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)</' + tag + '>', 'i');
  const m = re.exec(block);
  return m ? m[1].trim() : '';
}

function stripHtml(str) {
  return str.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}

function parseRSS(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = stripHtml(extractTag(block, 'title'));
    let desc = stripHtml(extractTag(block, 'description'));
    const link = extractTag(block, 'link') || extractTag(block, 'guid');
    const pubDate = extractTag(block, 'pubDate');
    if (title && title.length > 4) {
      if (desc.length > 140) desc = desc.slice(0, 140) + '…';
      items.push({ title, desc, link, pubDate });
    }
  }
  return items;
}

function dedupe(items) {
  const seen = new Set();
  const out = [];
  items.forEach(function (it) {
    const key = it.title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]/g, '');
    if (key && !seen.has(key)) {
      seen.add(key);
      out.push(it);
    }
  });
  return out;
}

const STOPWORDS = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','i','you','he','she','it','we','they','this','that','these','those','here','what','when','where','how','why','now','been','from','by','as','its','into','about','over','under','more','most','than','then','so','if','not','no','yes','ive','been','heres','whats','her','his','their','my','your','our','40','2026','ready','wear','fall','spring','summer','winter']);

const FASHION_KEYWORDS = ['fashion','style','outfit','trend','wear','dress','look','street','runway','collection','wardrobe','styling','chic','vibe','aesthetic','lookbook'];

function pickKeywords(title) {
  const words = title.split(/[\s,，:：|\-—'’"()]+/).filter(function (w) {
    var lw = w.toLowerCase();
    return w.length > 2 && w.length < 12 && !STOPWORDS.has(lw) && !/^\d+$/.test(w);
  });
  return words.slice(0, 3);
}

function fashionScore(title, desc) {
  var text = (title + ' ' + desc).toLowerCase();
  var score = 0;
  FASHION_KEYWORDS.forEach(function (k) { if (text.indexOf(k) >= 0) score++; });
  return score;
}

async function main() {
  console.error('STYLE LAB 趋势抓取开始', new Date().toISOString());

  let allItems = [];
  for (const url of RSS_SOURCES) {
    const items = await fetchRSS(url);
    allItems = allItems.concat(items);
  }

  console.error('合计抓取:', allItems.length, '条');

  const deduped = dedupe(allItems);
  // 按穿搭相关性排序，优先展示穿搭/趋势类内容
  deduped.sort(function (a, b) {
    return fashionScore(b.title, b.desc) - fashionScore(a.title, a.desc);
  });
  const top = deduped.slice(0, 6);

  if (top.length === 0) {
    console.error('未抓到任何趋势，保留旧数据');
    process.exit(0);
  }

  const trends = top.map(function (it, i) {
    return {
      name: it.title.length > 40 ? it.title.slice(0, 40) + '…' : it.title,
      emoji: '✨',
      desc: it.desc || it.title,
      tags: pickKeywords(it.title),
      bg: CARD_BG[i % CARD_BG.length],
      hot: HOT_LABELS[i] || 'NEW',
      link: it.link || ''
    };
  });

  const output = {
    updated: new Date().toISOString(),
    source: 'RSS (' + RSS_SOURCES.length + ' sources)',
    trends: trends
  };

  const outPath = path.join(__dirname, '..', 'data', 'trends.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');
  console.error('已写入', outPath, '->', trends.length, '条趋势');
}

main().catch(function (e) {
  console.error('脚本异常:', e);
  process.exit(0); // 不阻断 Actions，保留旧数据
});
