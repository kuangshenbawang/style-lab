/* ============================================
   STYLE LAB — App Logic
   ============================================ */

(function () {
  'use strict';

  /* ===== NAV ===== */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section, #hero');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinksContainer = document.querySelector('.nav-links');

  menuToggle.addEventListener('click', function () {
    navLinksContainer.classList.toggle('open');
  });

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navLinksContainer.classList.remove('open');
    });
  });

  // Scroll spy
  window.addEventListener('scroll', function () {
    let current = '';
    sections.forEach(function (sec) {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.dataset.section === current);
    });
  });

  /* ===== SECTION 1: STYLE MATCHER ===== */
  var selections = { mood: null, occasion: null, season: null };
  var currentStep = 1;

  // Style archetype database
  var STYLE_ARCHETYPES = {
    // mood × occasion combos produce base style, season adjusts palette
    'energetic|casual': { name: '都市运动风', desc: '运动元素融入日常穿搭，舒适与时尚并存。强调功能性与潮流感的平衡，让每一天都充满活力。', keywords: ['运动休闲', '机能面料', '层次叠穿', '街头感'], outfit: ['速干T恤 / 运动背心打底', '宽松工装裤或束脚运动裤', '老爹鞋或跑鞋', '棒球帽 + 斜挎小包'] },
    'energetic|date': { name: '活力甜酷风', desc: '甜美与酷感碰撞，既有少女感又不失个性。色彩明亮但剪裁利落，约会中自带焦点光环。', keywords: ['甜酷', '亮色点缀', '短款上衣', '个性配饰'], outfit: ['短款crop top或露肩上衣', '高腰A字裙 / 阔腿裤', '厚底鞋或马丁靴', '亮色耳环 + 链条包'] },
    'energetic|party': { name: '闪亮派对风', desc: '灯光下的焦点，大胆用色与闪光元素。不怕抢镜，派对就该做最亮的那颗星。', keywords: ['亮片', '撞色', '廓形感', '舞台感'], outfit: ['亮片上衣 / 金属色单品', '皮裤或亮面短裙', '高跟鞋或厚底靴', '夸张耳饰 + 手拿包'] },
    'energetic|work': { name: '干练职场风', desc: '专业但不沉闷，在得体中注入活力。用剪裁和细节展现自信，让职场穿搭也有态度。', keywords: ['利落剪裁', '中性色', '质感面料', '细节亮点'], outfit: ['修身西装外套', '内搭丝质衬衫 / 高领针织', '直筒西裤或铅笔裙', '乐福鞋 + 简约腕表'] },
    'energetic|travel': { name: '探索旅行风', desc: '兼顾舒适与上镜，机能与风格并重。轻装上阵也能拍出大片感，旅行穿搭就要实用又好看。', keywords: ['机能', '轻便', '叠穿', '实用口袋'], outfit: ['防晒风衣 / 冲锋衣', '速干T恤 + 遮阳帽', '工装裤或徒步裤', '登山鞋 + 双肩包'] },
    'energetic|street': { name: '街头潮流风', desc: '街头文化与时尚的碰撞，大胆配色与oversized廓形。走在街上就是行走的潮流封面。', keywords: ['oversized', '撞色', 'Logo元素', '球鞋文化'], outfit: ['Oversized卫衣 / 印花Tee', '宽松牛仔裤或工装裤', '限量球鞋', '渔夫帽 + 项链叠搭'] },

    'calm|casual': { name: '松弛日常风', desc: '不费力的高级感，柔和色调与舒适面料。看似随意却处处用心，松弛感才是最高级的穿搭。', keywords: ['松弛感', '莫兰迪色', '棉麻面料', '简约'], outfit: ['宽松针织衫 / 棉质衬衫', '直筒牛仔裤或阔腿裤', '帆布鞋或乐福鞋', '帆布托特包'] },
    'calm|date': { name: '温柔浪漫风', desc: '柔美色调与飘逸面料，营造浪漫氛围。不刻意却恰到好处，约会的每一帧都是电影感。', keywords: ['温柔', '飘逸', '柔和色调', '女性化'], outfit: ['雪纺衬衫 / 针织开衫', '半身长裙或碎花裙', '平底穆勒鞋', '珍珠耳环 + 链条包'] },
    'calm|party': { name: '低调质感风', desc: '不争抢却自带气场，靠面料与剪裁取胜。低调奢华，派对中的高级存在感。', keywords: ['质感', '丝绒', '暗色系', '精致'], outfit: ['丝绒上衣 / 缎面吊带', '高腰阔腿裤', '尖头高跟鞋', '精致手拿包 + 细链项链'] },
    'calm|work': { name: '知性通勤风', desc: '温柔而有力量，柔和色调中见专业。不强势却有说服力，知性穿搭的最高境界。', keywords: ['知性', '大地色', '质感', '得体'], outfit: ['针织开衫 / 软西装', '内搭真丝衬衫', '烟管裤或midi裙', '中跟单鞋 + 简约项链'] },
    'calm|travel': { name: '舒适旅行风', desc: '把舒适做到极致的同时保持格调。宽松叠穿，柔软面料，让旅途中的自己也是一道风景。', keywords: ['舒适', '叠穿', '大地色', '轻便'], outfit: ['宽松亚麻衬衫', '内搭背心 + 阔腿裤', '运动鞋或凉鞋', '宽檐帽 + 编织包'] },
    'calm|street': { name: '极简街头风', desc: 'less is more的街头演绎，干净利落的线条与中性色。不堆砌却自带高级街头感。', keywords: ['极简', '中性', '干净线条', '高级感'], outfit: ['纯色宽松T恤 / 卫衣', '直筒裤或阔腿裤', '小白鞋或复古跑鞋', '极简帆布包 + 银色耳圈'] },

    'bold|casual': { name: '大胆个性风', desc: '日常也要有态度，撞色与个性单品。不跟随潮流，自己就是风格本身。', keywords: ['个性', '撞色', 'oversized', '态度'], outfit: ['印花T恤 / 撞色卫衣', '宽松牛仔裤或皮裤', '厚底靴或老爹鞋', '个性墨镜 + 银饰叠搭'] },
    'bold|date': { name: '性感酷飒风', desc: '大胆展露与酷感剪裁，性感中带着攻击性。约会的视觉冲击力拉满，让人过目不忘。', keywords: ['性感', '皮革', '深V', '酷感'], outfit: ['皮衣 / 深V上衣', '紧身裤或皮裙', '细高跟或机车靴', 'choker + 手环叠戴'] },
    'bold|party': { name: '前卫实验风', desc: '派对是实验场，大胆廓形与未来感材质。不走安全路线，做派对上最独特的存在。', keywords: ['前卫', '廓形', '金属', '未来感'], outfit: ['金属色外套 / 不对称剪裁上衣', '皮裤或亮面短裙', 'platform靴子', '未来感耳饰 + 链条包'] },
    'bold|work': { name: '强势职场风', desc: '职场女王的穿搭语言，利落剪裁与深色系。气场全开，用穿搭宣告主场。', keywords: ['强势', '利落', '深色', '气场'], outfit: ['黑色西装外套 / 双排扣西装', '内搭丝质衬衫', '铅笔裙或西装裤', '尖头高跟鞋 + 腕表'] },
    'bold|travel': { name: '冒险机能风', desc: '机能与冒险美学结合，大胆配色与多口袋设计。旅行路上也要做最酷的那个。', keywords: ['机能', '多口袋', '撞色', '户外'], outfit: ['机能冲锋衣 / 多口袋马甲', '工装裤或战术裤', '战术靴或登山鞋', '战术帽 + 腰包'] },
    'bold|street': { name: '高街潮流风', desc: '高级街头与潮流文化的融合，大胆配色与奢侈街头混搭。街头就是秀场，每一步都是态度。', keywords: ['高街', '混搭', '奢侈街头', 'logo'], outfit: ['设计师卫衣 / 印花外套', '解构牛仔裤或工装裤', '限量球鞋', '设计师墨镜 + 银链'] },

    'elegant|casual': { name: '优雅日常风', desc: '日常穿搭也保持优雅格调，简约中见品味。不费力的精致感，让平凡日子也有仪式感。', keywords: ['优雅', '简约', '质感', '经典'], outfit: ['羊绒针织 / 丝质衬衫', '高腰直筒裤', '乐福鞋或芭蕾平底鞋', '简约手提包 + 珍珠耳钉'] },
    'elegant|date': { name: '法式优雅风', desc: '法式慵懒与优雅的结合，不刻意却精致到骨子里。约会的每一秒都像巴黎街头电影。', keywords: ['法式', '慵懒', '红唇', '复古'], outfit: ['法式碎花裙 / 缎面吊带裙', '薄针织开衫', '猫跟鞋或芭蕾鞋', '丝巾 + 复古耳环'] },
    'elegant|party': { name: '经典晚装风', desc: '经典不过晚装的优雅，简洁线条与高级面料。不需要繁复装饰，优雅本身就是最好的礼服。', keywords: ['经典', '丝缎', '简约', '高级'], outfit: ['丝缎礼服裙 / 简约晚装', '披肩或丝质外套', '高跟鞋', '钻石耳钉 + 手拿包'] },
    'elegant|work': { name: '精英职场风', desc: '精英阶层的穿搭智慧，质感面料与合体剪裁。专业、优雅、有力量，每个细节都在说话。', keywords: ['精英', '合体', '质感', '专业'], outfit: ['定制西装 / 质感大衣', '真丝衬衫内搭', '西裤或midi裙', '中跟尖头鞋 + 名牌腕表'] },
    'elegant|travel': { name: '度假优雅风', desc: '旅行中也不放弃优雅，飘逸面料与度假色调。在度假村也能拍出时尚大片。', keywords: ['度假', '飘逸', '柔和', '精致'], outfit: ['亚麻衬衫裙 / 雪纺长裙', '宽檐草帽', '凉鞋或坡跟鞋', '编织手提包 + 太阳镜'] },
    'elegant|street': { name: '静奢街头风', desc: 'Quiet Luxury 街头演绎，无logo却有质感。低调到极致就是高级，街头也能优雅。', keywords: ['静奢', '无logo', '质感', '低调'], outfit: ['羊绒卫衣 / 质感风衣', '高腰阔腿裤', '极简小白鞋', '真皮托特包 + 银色耳钉'] },

    'playful|casual': { name: '元气少女风', desc: '青春活力的穿搭表达，明亮色彩与可爱元素。日常穿搭也要元气满满，快乐会传染。', keywords: ['元气', '亮色', '可爱', '青春'], outfit: ['彩色卫衣 / 印花Tee', '牛仔短裙或背带裤', '帆布鞋或老爹鞋', '彩色发夹 + 双肩包'] },
    'playful|date': { name: '甜美少女风', desc: '甜美元素的约会穿搭，柔和色调与可爱剪裁。让人忍不住想靠近的甜美感。', keywords: ['甜美', '粉色系', '蝴蝶结', '少女'], outfit: ['泡泡袖上衣 / 荷叶边衬衫', '百褶短裙或纱裙', '玛丽珍鞋或平底鞋', '蝴蝶结发饰 + 链条包'] },
    'playful|party': { name: '活力派对风', desc: '派对的快乐源泉，亮色与趣味元素。不怕夸张，派对就是尽情做自己的地方。', keywords: ['亮色', '趣味', '夸张', '派对'], outfit: ['亮色连衣裙 / 荷叶边上衣', '亮片半裙或彩色裤', '厚底鞋或亮色高跟鞋', '彩色耳环 + 亮片手包'] },
    'playful|work': { name: '俏皮职场风', desc: '在专业中保留一点俏皮，用亮色配饰点缀基本款。让职场不那么无聊，俏皮也是一种能力。', keywords: ['俏皮', '亮色点缀', '基本款', '职场'], outfit: ['白色衬衫 / 针织上衣', '高腰西裤或A字裙', '乐福鞋或中跟鞋', '亮色丝巾 + 彩色耳钉'] },
    'playful|travel': { name: '快乐旅行风', desc: '旅行就要开心穿搭，亮色与舒适并重。拍出来的照片都自带快乐滤镜。', keywords: ['快乐', '亮色', '舒适', '出片'], outfit: ['彩色T恤 / 印花衬衫', '牛仔短裤或休闲裤', '运动鞋或凉鞋', '彩色遮阳帽 + 帆布包'] },
    'playful|street': { name: 'Y2K潮流风', desc: '千禧年美学回归，亮色、低腰、金属元素。复古又未来感，Y2K就是最in的街头表达。', keywords: ['Y2K', '低腰', '金属', '千禧'], outfit: ['短款 Baby Tee / 露脐上衣', '低腰牛仔裤或工装裙', '厚底鞋或老爹鞋', '金属色配饰 + 迷你包'] },

    'mysterious|casual': { name: '暗黑日常风', desc: 'all black 的日常美学，用材质变化制造层次。低调神秘，日常也有暗黑态度。', keywords: ['暗黑', 'all black', '材质层次', '神秘'], outfit: ['黑色卫衣 / 黑色衬衫', '黑色直筒裤或牛仔裤', '黑色靴子或运动鞋', '黑色帽 + 银色戒指'] },
    'mysterious|date': { name: '神秘魅惑风', desc: '暗色调中的性感，若隐若现最迷人。神秘感是最好的吸引力，让人想一探究竟。', keywords: ['神秘', '暗色', '透视', '魅惑'], outfit: ['黑色蕾丝上衣 / 透视衬衫', '皮裙或黑色阔腿裤', '黑色细高跟', '深色唇 + 银色项链'] },
    'mysterious|party': { name: '暗黑哥特风', desc: '哥特美学的派对演绎，黑色、皮革、金属配件。派对上的神秘存在，暗黑也是一种极致的美。', keywords: ['哥特', '皮革', '金属', '暗黑'], outfit: ['黑色皮衣 / 蕾丝上衣', '黑色皮裤或纱裙', '机车靴或 platform 鞋', 'choker + 银色十字架配饰'] },
    'mysterious|work': { name: '冷感职场风', desc: '高冷职场穿搭，深色系与利落剪裁。不多话但气场十足，神秘感也是一种职场武器。', keywords: ['冷感', '深色', '利落', '气场'], outfit: ['深色西装 / 黑色高领', '黑色西裤或铅笔裙', '黑色尖头高跟鞋', '简约银色腕表 + 耳钉'] },
    'mysterious|travel': { name: '酷感旅行风', desc: '旅行也要酷，暗色系机能穿搭。低调却与众不同，旅行路上也能保持神秘气场。', keywords: ['酷感', '暗色', '机能', '低调'], outfit: ['黑色冲锋衣 / 深色机能外套', '黑色工装裤', '黑色登山鞋', '黑色帽 + 墨镜'] },
    'mysterious|street': { name: '暗黑街头风', desc: '暗黑美学的街头表达，all black + 解构设计。街头最酷的存在，不需要色彩也能有态度。', keywords: ['暗黑', '解构', 'all black', '街头'], outfit: ['黑色oversized卫衣 / 解构外套', '黑色宽松裤或工装裤', '黑色高帮鞋', '黑色冷帽 + 银链'] }
  };

  // Season palettes
  var SEASON_PALETTES = {
    spring: { name: '春日柔光', colors: ['#F5E6D3', '#E8C4A0', '#C4704B', '#7BAB6E', '#F2D4DC'] },
    summer: { name: '夏日清透', colors: ['#E0F0F5', '#A8D8E8', '#4A90A4', '#F5E6D3', '#FFD93D'] },
    autumn: { name: '秋日暖棕', colors: ['#3D2E24', '#9C5836', '#C4704B', '#E8C4A0', '#7A5C3E'] },
    winter: { name: '冬日冷调', colors: ['#1A1A1A', '#4A4A4A', '#8B8B8B', '#D4D4D4', '#C4704B'] }
  };

  // 每个 archetype 的英文搜索词（供图片 API 搜索）
  var SEARCH_QUERIES = {
    'energetic|casual': 'athleisure street style outfit',
    'energetic|date': 'sweet cool fashion outfit date',
    'energetic|party': 'sparkle party outfit sequin',
    'energetic|work': 'smart casual work outfit women',
    'energetic|travel': 'travel outfit activewear adventure',
    'energetic|street': 'streetwear oversized outfit sneakers',
    'calm|casual': 'minimalist casual relaxed outfit',
    'calm|date': 'romantic soft feminine outfit date',
    'calm|party': 'elegant velvet party outfit',
    'calm|work': 'smart casual chic work outfit',
    'calm|travel': 'comfortable travel linen outfit',
    'calm|street': 'minimal street style neutral outfit',
    'bold|casual': 'bold statement outfit color block',
    'bold|date': 'sexy edgy leather outfit date',
    'bold|party': 'avant garde fashion party outfit',
    'bold|work': 'power suit women strong work outfit',
    'bold|travel': 'techwear utility outfit travel',
    'bold|street': 'high street fashion designer outfit',
    'elegant|casual': 'elegant casual chic outfit',
    'elegant|date': 'french chic elegant outfit date',
    'elegant|party': 'evening gown elegant party outfit',
    'elegant|work': 'elegant business professional outfit',
    'elegant|travel': 'elegant resort vacation outfit',
    'elegant|street': 'quiet luxury street style outfit',
    'playful|casual': 'cute colorful casual outfit young',
    'playful|date': 'sweet cute date outfit feminine',
    'playful|party': 'fun colorful party outfit bright',
    'playful|work': 'playful work outfit colorful accessories',
    'playful|travel': 'fun colorful travel vacation outfit',
    'playful|street': 'y2k fashion outfit millennium street',
    'mysterious|casual': 'all black dark casual outfit',
    'mysterious|date': 'mysterious dark sexy outfit date',
    'mysterious|party': 'gothic dark party outfit leather',
    'mysterious|work': 'dark elegant work outfit cold',
    'mysterious|travel': 'dark techwear travel outfit',
    'mysterious|street': 'dark streetwear deconstructed outfit'
  };

  function selectOption(category, value, button) {
    selections[category] = value;
    // Visual feedback
    var siblings = button.parentElement.querySelectorAll('.option-card');
    siblings.forEach(function (s) { s.classList.remove('selected'); });
    button.classList.add('selected');

    // Advance to next step
    setTimeout(function () {
      if (currentStep < 3) {
        goToStep(currentStep + 1);
      } else {
        showResult();
      }
    }, 400);
  }

  function goToStep(step) {
    // Update step bar
    document.querySelectorAll('.step-item').forEach(function (item) {
      var s = parseInt(item.dataset.step);
      item.classList.toggle('active', s === step);
      item.classList.toggle('completed', s < step);
    });

    // Show/hide step content
    document.querySelectorAll('.matcher-step').forEach(function (el) {
      el.classList.toggle('hidden', parseInt(el.dataset.stepContent) !== step);
    });

    currentStep = step;
  }

  function showResult() {
    // Hide all steps
    document.querySelectorAll('.matcher-step').forEach(function (el) {
      el.classList.add('hidden');
    });
    // Mark all steps completed
    document.querySelectorAll('.step-item').forEach(function (item) {
      item.classList.add('completed');
      item.classList.remove('active');
    });

    // Get style archetype
    var key = selections.mood + '|' + selections.occasion;
    var style = STYLE_ARCHETYPES[key] || STYLE_ARCHETYPES['calm|casual'];
    var palette = SEASON_PALETTES[selections.season] || SEASON_PALETTES.autumn;

    // Populate result
    document.getElementById('result-style-name').textContent = style.name;
    document.getElementById('result-style-desc').textContent = style.desc;

    // Palette swatches
    var swatchHtml = palette.colors.map(function (c) {
      return '<div class="swatch" style="background:' + c + '" data-hex="' + c + '" title="' + c + '"></div>';
    }).join('');
    document.getElementById('palette-swatches').innerHTML = swatchHtml;

    // Keywords
    var kwHtml = style.keywords.map(function (k) {
      return '<span class="keyword-tag">' + k + '</span>';
    }).join('');
    document.getElementById('keyword-tags').innerHTML = kwHtml;

    // Outfit suggestions
    var outfitHtml = style.outfit.map(function (o) {
      return '<li>' + o + '</li>';
    }).join('');
    document.getElementById('outfit-list').innerHTML = outfitHtml;

    // 主题切换：根据 mood 切换 CSS 变量
    document.body.setAttribute('data-theme', selections.mood);

    // Show result
    document.getElementById('matcher-result').classList.remove('hidden');

    // 加载穿搭参考图（瀑布流）
    loadStyleImages(key, style.name);
  }

  /* ===== 图片瀑布流 ===== */

  function loadStyleImages(archetypeKey, styleName) {
    var cfg = window.STYLE_LAB_CONFIG || {};
    var waterfall = document.getElementById('image-waterfall');
    var sourceLabel = document.getElementById('result-images-source');
    var query = SEARCH_QUERIES[archetypeKey] || 'fashion outfit style';
    var count = cfg.imageCount || 6;
    var proxy = cfg.imageProxy || '/api/images';
    var source = cfg.imageSource || 'auto';

    // 显示加载中
    waterfall.innerHTML = '<div class="image-loading-hint">正在为你寻找穿搭灵感…</div>';
    sourceLabel.textContent = '';

    var url = proxy + '?q=' + encodeURIComponent(query) + '&count=' + count + '&source=' + source;

    // 带超时的 fetch
    var fetchPromise = fetch(url, { method: 'GET' });
    var timeoutPromise = new Promise(function (_, reject) {
      setTimeout(function () { reject(new Error('timeout')); }, cfg.imageTimeout || 8000);
    });

    Promise.race([fetchPromise, timeoutPromise])
      .then(function (res) {
        if (!res.ok) throw new Error('proxy error ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (data && data.images && data.images.length > 0) {
          renderImageWaterfall(data.images);
          sourceLabel.textContent = data.source || '';
        } else {
          renderImageFallback(styleName);
        }
      })
      .catch(function () {
        renderImageFallback(styleName);
      });
  }

  function renderImageWaterfall(images) {
    var waterfall = document.getElementById('image-waterfall');
    var html = images.map(function (img) {
      var src = img.url || img.urls && img.urls.regular || '';
      var alt = img.alt || img.description || '穿搭参考';
      var credit = img.credit || '';
      var link = img.link || '';
      if (!src) return '';
      var inner = '<img src="' + escapeAttr(src) + '" alt="' + escapeAttr(alt) + '" loading="lazy" onerror="this.parentElement.style.display=\'none\'">';
      if (credit) {
        inner += '<div class="image-waterfall-credit">photo: ' + escapeHtml(credit) + '</div>';
      }
      if (link) {
        return '<a class="image-waterfall-item" href="' + escapeAttr(link) + '" target="_blank" rel="noopener">' + inner + '</a>';
      }
      return '<div class="image-waterfall-item">' + inner + '</div>';
    }).join('');
    waterfall.innerHTML = html || '<div class="image-loading-hint">暂无参考图</div>';
  }

  function renderImageFallback(styleName) {
    // 后端未部署时优雅降级：显示风格名 + 配色占位卡
    var waterfall = document.getElementById('image-waterfall');
    waterfall.innerHTML =
      '<div class="image-waterfall-item">' +
        '<div class="image-waterfall-item-placeholder">' +
          '<div class="placeholder-style">' + escapeHtml(styleName) + '</div>' +
          '<div>穿搭参考图功能待激活</div>' +
        '</div>' +
      '</div>' +
      '<div class="image-waterfall-item">' +
        '<div class="image-waterfall-item-placeholder">' +
          '<div class="placeholder-style">STYLE LAB</div>' +
          '<div>部署图片代理后<br>自动展示真实穿搭参考</div>' +
        '</div>' +
      '</div>' +
      '<div class="image-waterfall-item">' +
        '<div class="image-waterfall-item-placeholder">' +
          '<div class="placeholder-style">&#10024;</div>' +
          '<div>敬请期待</div>' +
        '</div>' +
      '</div>';
    document.getElementById('result-images-source').textContent = '';
  }

  function escapeAttr(str) {
    return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;');
  }

  function restartMatcher() {
    selections = { mood: null, occasion: null, season: null };
    currentStep = 1;
    document.querySelectorAll('.option-card').forEach(function (c) {
      c.classList.remove('selected');
    });
    document.getElementById('matcher-result').classList.add('hidden');
    goToStep(1);
  }

  // Bind option cards
  document.querySelectorAll('.option-card').forEach(function (card) {
    card.addEventListener('click', function () {
      var cat = card.dataset.category;
      var val = card.dataset.value;
      selectOption(cat, val, card);
    });
  });

  document.getElementById('btn-restart').addEventListener('click', restartMatcher);

  /* ===== SECTION 2: COLOR LAB ===== */

  // HSL → HEX
  function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    var c = (1 - Math.abs(2 * l - 1)) * s;
    var x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    var m = l - c / 2;
    var r, g, b;
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    return '#' + [r, g, b].map(function (v) {
      var hex = v.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  // HEX → HSL
  function hexToHsl(hex) {
    var r = parseInt(hex.slice(1, 3), 16) / 255;
    var g = parseInt(hex.slice(3, 5), 16) / 255;
    var b = parseInt(hex.slice(5, 7), 16) / 255;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
        case g: h = ((b - r) / d + 2); break;
        case b: h = ((r - g) / d + 4); break;
      }
      h *= 60;
    }
    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  function getContrastColor(hex) {
    var hsl = hexToHsl(hex);
    return hsl.l > 55 ? '#1a1a1a' : '#ffffff';
  }

  // Generate harmony palette
  function generateHarmony(baseHex, type) {
    var hsl = hexToHsl(baseHex);
    var colors = [];
    var i;

    switch (type) {
      case 'complementary':
        colors = [
          hslToHex(hsl.h, hsl.s, Math.max(20, hsl.l - 20)),
          hslToHex(hsl.h, hsl.s, hsl.l),
          hslToHex(hsl.h, Math.max(10, hsl.s - 30), Math.min(90, hsl.l + 15)),
          hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
          hslToHex((hsl.h + 180) % 360, Math.max(10, hsl.s - 20), Math.min(90, hsl.l + 10))
        ];
        break;
      case 'analogous':
        colors = [
          hslToHex((hsl.h - 60 + 360) % 360, hsl.s, Math.max(25, hsl.l - 10)),
          hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l),
          hslToHex(hsl.h, hsl.s, hsl.l),
          hslToHex((hsl.h + 30) % 360, hsl.s, Math.min(85, hsl.l + 5)),
          hslToHex((hsl.h + 60) % 360, hsl.s, Math.min(88, hsl.l + 10))
        ];
        break;
      case 'triadic':
        colors = [
          hslToHex(hsl.h, hsl.s, Math.max(25, hsl.l - 15)),
          hslToHex(hsl.h, hsl.s, hsl.l),
          hslToHex(hsl.h, Math.max(10, hsl.s - 25), Math.min(88, hsl.l + 12)),
          hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
          hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l)
        ];
        break;
      case 'monochrome':
        colors = [];
        for (i = 0; i < 5; i++) {
          var lightness = Math.max(18, Math.min(92, hsl.l - 30 + i * 18));
          colors.push(hslToHex(hsl.h, hsl.s, lightness));
        }
        break;
    }
    return colors;
  }

  // Palette descriptions
  var PALETTE_DESCRIPTIONS = {
    complementary: { name: '互补撞色', desc: '对比强烈，视觉冲击力强，适合大胆穿搭' },
    analogous: { name: '邻近和谐', desc: '色调接近，温柔过渡，日常百搭不出错' },
    triadic: { name: '三角均衡', desc: '色彩丰富但平衡，适合有层次感的穿搭' },
    monochrome: { name: '同色层次', desc: '单一色相不同明度，高级简约感' }
  };

  // Outfit item mapping for color positions
  var OUTFIT_ITEMS = ['外套/上装', '内搭', '裤装/裙装', '鞋履', '配饰'];

  var BASE_COLORS = [
    '#1A1A1A', '#FFFFFF', '#C4704B', '#9C5836', '#E8C4A0', '#F5E6D3',
    '#D44637', '#E8734A', '#F5A623', '#7BAB6E', '#4A90A4', '#5B6CB0',
    '#8B5CA8', '#D4A5D8', '#F2D4DC', '#8B8B8B', '#4A4A4A', '#3D5A40'
  ];

  // Build color picker
  var pickerGrid = document.getElementById('color-picker-grid');
  BASE_COLORS.forEach(function (c, idx) {
    var swatch = document.createElement('div');
    swatch.className = 'color-swatch';
    swatch.style.background = c;
    swatch.dataset.color = c;
    swatch.title = c;
    if (idx === 2) {
      swatch.classList.add('selected'); // Default select accent color
    }
    swatch.addEventListener('click', function () {
      document.querySelectorAll('.color-swatch').forEach(function (s) {
        s.classList.remove('selected');
      });
      swatch.classList.add('selected');
      updatePalette(c);
    });
    pickerGrid.appendChild(swatch);
  });

  function updatePalette(baseHex) {
    var harmonyType = document.getElementById('harmony-type').value;
    var colors = generateHarmony(baseHex, harmonyType);
    var desc = PALETTE_DESCRIPTIONS[harmonyType];

    // Palette display
    var display = document.getElementById('palette-display');
    display.innerHTML = colors.map(function (c) {
      var textColor = getContrastColor(c);
      return '<div class="palette-color" style="background:' + c + ';color:' + textColor + '">' + c + '</div>';
    }).join('');

    // Palette info
    document.getElementById('palette-info').innerHTML =
      '<p class="palette-name">' + desc.name + '</p>' +
      '<p class="palette-desc">' + desc.desc + '</p>';

    // Outfit preview
    var preview = document.getElementById('outfit-preview');
    var previewHtml = '<h4>穿搭建议</h4>';
    colors.forEach(function (c, i) {
      var item = OUTFIT_ITEMS[i] || '点缀色';
      previewHtml += '<div class="outfit-preview-item">' +
        '<div class="outfit-preview-dot" style="background:' + c + '"></div>' +
        '<span class="outfit-preview-text">' + item + ' — ' + c + '</span>' +
        '</div>';
    });
    preview.innerHTML = previewHtml;
  }

  // Harmony type change
  document.getElementById('harmony-type').addEventListener('change', function () {
    var selected = document.querySelector('.color-swatch.selected');
    if (selected) {
      updatePalette(selected.dataset.color);
    }
  });

  // Init palette with default color
  updatePalette('#C4704B');

  /* ===== SECTION 3: CAPTION STUDIO ===== */

  var CAPTION_TEMPLATES = {
    xiaohongshu: {
      intro: ['姐妹们！今天这套真的绝了', 'OOTD | 又是被自己帅到的一天', '今日穿搭分享 不可错过的一套', '这套我愿称之为本季最佳', '谁懂啊 这套真的太好看了'],
      body: {
        street: ' oversized的版型自带松弛感，工装裤+球鞋的搭配把街头感拉满。每一个细节都在说：我不跟随潮流，我就是潮流。',
        minimal: 'less is more。没有多余的装饰，只有剪裁和面料的对话。极简不是无聊，是最高级的克制。',
        vintage: '复古回潮。灯芯绒的质感、高腰的剪裁，仿佛穿越回了那个黄金年代。复古不是模仿，是致敬。',
        casual: '日常也要有态度。舒适的面料 + 不经意的搭配，松弛感才是穿搭的最高境界。',
        formal: '得体不意味着无聊。合体的剪裁 + 精致的面料，职场穿搭也可以很有态度。',
        y2k: '千禧美学回归！低腰+crop top+厚底鞋，Y2K女孩永远在路上。这不是复古，这是未来。',
        gorpcore: '机能美学。多口袋设计 + 防水面料，户外机能风也可以很时髦。实用与潮流从不矛盾。'
      },
      outro: ['快告诉我你们最喜欢单品哪个？', '评论区告诉我你的穿搭灵感', '这套你们给几分？', '点赞收藏 穿搭不迷路', '关注我 每天分享穿搭灵感'],
      tags: ['#OOTD', '#穿搭分享', '#每日穿搭', '#穿搭灵感', '#时尚穿搭']
    },
    douyin: {
      intro: ['这套穿搭我先冲了', '谁穿谁好看的穿搭公式', '今日穿搭 直接抄作业', '这套真的yyds', '穿搭博主在线发车'],
      body: {
        street: 'oversized+工装裤+球鞋，街头三件套直接封神。出门回头率直接拉满，走在街上就是行走的穿搭教程。',
        minimal: '极简风穿搭公式：基础款+质感面料+干净配色。不挑人、不过时、不出错，极简yyds。',
        vintage: '复古风穿搭太有味道了！高腰线拉比例，复古色显白显气质。这套真的越看越好看。',
        casual: '日常穿搭天花板：舒服+好看+不费力。这才是真正的穿搭自由。',
        formal: '职场穿搭模板来了。得体+有型+不沉闷，面试通勤直接穿这套就对了。',
        y2k: 'Y2K穿搭太上头了！辣妹必备的低腰+短上衣，穿上就是千禧年本人。时髦精冲！',
        gorpcore: '机能风穿搭出片率太高了！多口袋+冲锋衣，实用又好看，户外穿搭天花板。'
      },
      outro: ['双击屏幕告诉我好不好看', '想看更多穿搭的扣1', '这套适不适合你？评论区告诉我', '关注不迷路 每天更新穿搭', '下期想看什么风格 留言告诉我'],
      tags: ['#穿搭', '#ootd', '#穿搭教程', '#日常穿搭', '#时尚']
    },
    instagram: {
      intro: ['Today\'s OOTD ', 'Outfit check ', 'Style of the day ', 'What I wore today ', 'Fit check '],
      body: {
        street: 'Oversized silhouette meets utility details. Street style is not just fashion, it\'s an attitude.',
        minimal: 'Minimalism at its finest. Clean lines, quality fabrics, zero noise. Less, but better.',
        vintage: 'Vintage vibes, modern twist. Channeling the golden era with contemporary edge.',
        casual: 'Effortless style is the hardest to master. Comfort meets aesthetic in perfect balance.',
        formal: 'Sharp tailoring, refined fabrics. Professional doesn\'t mean boring.',
        y2k: 'Y2K aesthetic on point. Low-rise, crop tops, chunky shoes — millennium energy never left.',
        gorpcore: 'Functional fashion. Utility meets aesthetics — gorpcore is the new luxury.'
      },
      outro: ['Which piece is your favorite? ', 'Rate this fit 1-10 ', 'Save for inspo ', 'Follow for daily fits ', 'What style next? '],
      tags: ['#ootd', '#fashion', '#style', '#outfit', '#fashioninspo']
    },
    weibo: {
      intro: ['今日穿搭分享，时尚是一种生活态度', 'OOTD｜穿衣自由，风格至上', '记录今日穿搭，每个细节都是态度', '穿搭日记｜今天这套我很满意', '时尚不是追逐潮流，而是找到自己'],
      body: {
        street: '街头风不仅仅是穿搭方式，更是一种文化表达。oversized的剪裁、工装的细节、球鞋的态度，每一件单品都在讲述属于街头的故事。',
        minimal: '极简主义穿搭的哲学在于：用最少的元素表达最多的态度。没有多余的装饰，只有面料与剪裁的纯粹对话。克制，是最高级的时尚。',
        vintage: '复古风潮的回归不是偶然。那些经典剪裁与怀旧色调，承载着对美好年代的致敬。复古不是怀旧，是经典的重生。',
        casual: '日常穿搭的真谛是：在舒适中找到风格。不刻意、不造作，让穿搭成为自然的表达。松弛感，是这个时代最稀缺的时尚。',
        formal: '职场穿搭的专业感来自合体剪裁与质感面料的结合。在得体中展现个性，在规范中找到自由，这才是成熟的穿搭智慧。',
        y2k: 'Y2K美学的回归印证了时尚的轮回。千禧年的大胆与张扬，在当下语境中焕发新生。这不是复古，是对未来的想象。',
        gorpcore: '机能风的流行反映了当代人对实用美学的追求。防水面料、多口袋设计，功能性与时尚感的完美结合，重新定义户外穿搭。'
      },
      outro: ['你的今日穿搭是什么风格？评论区分享', '喜欢这套搭配的请点赞', '关注我，一起探索穿搭的无限可能', '转发给那个总是问你穿什么的朋友', '你觉得时尚最重要的是什么？'],
      tags: ['#OOTD#', '#穿搭分享#', '#每日穿搭#', '#时尚穿搭#', '#穿搭日记#']
    }
  };

  var PLATFORM_NAMES = {
    xiaohongshu: '小红书',
    douyin: '抖音',
    instagram: 'Instagram',
    weibo: '微博'
  };

  function generateCaption() {
    var item = document.getElementById('cap-item').value.trim() || '今日穿搭';
    var style = document.getElementById('cap-style').value;
    var platform = document.getElementById('cap-platform').value;
    var mood = document.getElementById('cap-mood').value.trim() || '自信';

    var templates = CAPTION_TEMPLATES[platform];
    var intro = templates.intro[Math.floor(Math.random() * templates.intro.length)];
    var bodyText = templates.body[style] || templates.body.casual;
    var outro = templates.outro[Math.floor(Math.random() * templates.outro.length)];
    var tags = templates.tags.join(' ');

    var caption = intro + '\n\n';
    caption += item + ' — ' + mood + '的一套。\n';
    caption += bodyText + '\n\n';
    caption += outro + '\n\n';
    caption += tags;

    var platformName = PLATFORM_NAMES[platform];

    var output = document.getElementById('caption-output');
    output.innerHTML =
      '<div class="caption-result">' +
      '<span class="caption-platform">' + platformName + ' 风格</span>' +
      '<div class="caption-text">' + escapeHtml(caption) + '</div>' +
      '<div class="caption-tags">' +
      templates.tags.map(function (t) { return '<span class="caption-tag">' + escapeHtml(t) + '</span>'; }).join('') +
      '</div>' +
      '<button class="btn-copy" id="btn-copy">复制文案</button>' +
      '</div>';

    // Bind copy button
    document.getElementById('btn-copy').addEventListener('click', function () {
      copyToClipboard(caption);
      var btn = document.getElementById('btn-copy');
      btn.textContent = '已复制';
      btn.classList.add('copied');
      setTimeout(function () {
        btn.textContent = '复制文案';
        btn.classList.remove('copied');
      }, 2000);
    });
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(textarea);
    }
  }

  document.getElementById('btn-generate-caption').addEventListener('click', generateCaption);

  /* ===== SECTION 4: TREND BOARD（动态读取 data/trends.json）===== */

  // Fallback 趋势数据（JSON 加载失败时用）
  var FALLBACK_TRENDS = [
    {
      name: 'Quiet Luxury',
      emoji: '\uD83D\uDC51',
      desc: '静奢风持续火爆。无logo、高质感面料、低调配色，用品质说话而非品牌标识。',
      tags: ['静奢', '极简', '老钱风'],
      bg: 'linear-gradient(135deg, #f5f0eb, #e0d5c8)',
      hot: 'TOP 1'
    },
    {
      name: 'Gorpcore',
      emoji: '\uD83C\uDFD5',
      desc: '户外机能风从秀场走向街头。冲锋衣、工装裤、登山鞋，机能美学成为日常穿搭新标配。',
      tags: ['机能', '户外', '实用'],
      bg: 'linear-gradient(135deg, #2d3a2e, #4a6b50)',
      hot: 'TOP 2'
    },
    {
      name: 'Y2K Revival',
      emoji: '\uD83D\uDD25',
      desc: '千禧美学全面回归。低腰、crop top、金属色、厚底鞋，2000年代的辣妹风潮再次席卷。',
      tags: ['Y2K', '千禧', '辣妹'],
      bg: 'linear-gradient(135deg, #c4704b, #e8c4a0)',
      hot: 'TOP 3'
    },
    {
      name: 'Coastal Grandma',
      emoji: '\uD83C\uDFD6',
      desc: '海滨奶奶风松弛感拉满。亚麻衬衫、阔腿裤、编织包，度假式的优雅松弛成为都市新向往。',
      tags: ['松弛', '度假', '优雅'],
      bg: 'linear-gradient(135deg, #a8d8e8, #e0f0f5)',
      hot: 'HOT'
    },
    {
      name: 'Cyber Punk',
      emoji: '\uD83D\uDDA5',
      desc: '赛博朋克美学入侵日常。金属色、皮革、不对称剪裁，未来感穿搭打破现实边界。',
      tags: ['赛博', '未来感', '前卫'],
      bg: 'linear-gradient(135deg, #1a1a2e, #5b6cb0)',
      hot: 'HOT'
    },
    {
      name: 'Blokecore',
      emoji: '\u26BD',
      desc: '足球风穿搭出圈。复古球衣 + 直筒牛仔裤 + 德训鞋，运动文化与复古时尚的完美碰撞。',
      tags: ['足球风', '复古运动', '街头'],
      bg: 'linear-gradient(135deg, #3d5a40, #7bab6e)',
      hot: 'NEW'
    }
  ];

  function renderTrends(trends) {
    var trendsGrid = document.getElementById('trends-grid');
    trendsGrid.innerHTML = '';
    trends.forEach(function (t) {
      var card = document.createElement('div');
      card.className = 'trend-card';
      card.innerHTML =
        '<div class="trend-visual" style="background:' + (t.bg || 'var(--accent-light)') + '">' +
        '<span class="trend-hot">' + escapeHtml(t.hot || '') + '</span>' +
        '<span class="trend-emoji">' + (t.emoji || '\u2728') + '</span>' +
        '</div>' +
        '<div class="trend-body">' +
        '<h3 class="trend-name">' + escapeHtml(t.name) + '</h3>' +
        '<p class="trend-desc">' + escapeHtml(t.desc) + '</p>' +
        '<div class="trend-tags">' +
        (t.tags || []).map(function (tag) { return '<span class="trend-tag">' + escapeHtml(tag) + '</span>'; }).join('') +
        '</div>' +
        '</div>';
      trendsGrid.appendChild(card);
    });
  }

  function loadTrends() {
    var cfg = window.STYLE_LAB_CONFIG || {};
    var url = cfg.trendsUrl || './data/trends.json';
    fetch(url, { method: 'GET' })
      .then(function (res) {
        if (!res.ok) throw new Error('trends fetch error');
        return res.json();
      })
      .then(function (data) {
        var trends = (data && data.trends && data.trends.length > 0) ? data.trends : FALLBACK_TRENDS;
        renderTrends(trends);
      })
      .catch(function () {
        renderTrends(FALLBACK_TRENDS);
      });
  }

  loadTrends();

})();
