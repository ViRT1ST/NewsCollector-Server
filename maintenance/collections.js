const mongoose = require('mongoose');

const sources = [
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf840'),
    site: 'DTF',
    section: 'Индустрия',
    url: 'https://dtf.ru/rss/gameindustry',
    regex: '^.*?dtf.ru\/gameindustry\/\\d{7}.*$',
    removeInTitle: '— Индустрия на DTF',
    parsingMethod: 'rss',
    translateTitle: false,
    enabled: false
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf839'),
    site: 'DTF',
    section: 'Игры',
    url: 'https://dtf.ru/rss/games',
    regex: '^.*?dtf.ru\/games\/\\d{7}.*$',
    removeInTitle: '— Игры на DTF',
    parsingMethod: 'rss',
    translateTitle: false,
    enabled: false
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf838'),
    site: 'DTF',
    section: 'Гайды',
    url: 'https://dtf.ru/rss/howto',
    regex: '^.*?dtf.ru\/howto\/\\d{7}.*$',
    removeInTitle: '— Гайды на DTF',
    parsingMethod: 'rss',
    translateTitle: false,
    enabled: false
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf837'),
    site: 'DTF',
    section: 'Жизнь',
    url: 'https://dtf.ru/rss/life',
    regex: '^.*?dtf.ru\/life\/\\d{7}.*$',
    removeInTitle: '— Жизнь на DTF',
    parsingMethod: 'rss',
    translateTitle: false,
    enabled: false
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf836'),
    site: 'DTF',
    section: 'Железо',
    url: 'https://dtf.ru/rss/hard',
    regex: '^.*?dtf.ru\/hard\/\\d{7}.*$',
    removeInTitle: '— Железо на DTF',
    parsingMethod: 'rss',
    translateTitle: false,
    enabled: false
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf835'),
    site: 'DTF',
    section: 'Скидки',
    url: 'https://dtf.ru/rss/sale',
    regex: '^.*?dtf.ru\/sale\/\\d{7}.*$',
    removeInTitle: '— Скидки на DTF',
    parsingMethod: 'rss',
    translateTitle: false,
    enabled: false
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf834'),
    site: 'DTF',
    section: 'Кино и сериалы',
    url: 'https://dtf.ru/rss/cinema',
    regex: '^.*?dtf.ru\/cinema\/\\d{7}.*$',
    removeInTitle: '— Кино и сериалы на DTF',
    parsingMethod: 'rss',
    translateTitle: false,
    enabled: false
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf833'),
    site: 'DTF',
    section: 'Геймдев',
    url: 'https://dtf.ru/rss/gamedev',
    regex: '^.*?dtf.ru\/gamedev\/\\d{7}.*$',
    removeInTitle: '— Gamedev на DTF',
    parsingMethod: 'rss',
    translateTitle: false,
    enabled: false
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf832'),
    site: 'DTF',
    section: 'Скриншоты',
    url: 'https://dtf.ru/rss/screenshots',
    regex: '^.*?dtf.ru\/screenshots\/\\d{7}.*$',
    removeInTitle: '— Скриншоты на DTF',
    parsingMethod: 'rss',
    translateTitle: false,
    enabled: false
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf831'),
    site: 'DTF',
    section: 'Автоспорт',
    url: 'https://dtf.ru/rss/racing',
    regex: '^.*?dtf.ru\/racing\/\\d{7}.*$',
    removeInTitle: '— Автоспорт на DTF',
    parsingMethod: 'rss',
    translateTitle: false,
    enabled: false
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf830'),
    site: 'DTF',
    section: 'Вопросы',
    url: 'https://dtf.ru/rss/ask',
    regex: '^.*?dtf.ru\/ask\/\\d{7}.*$',
    removeInTitle: '— Вопросы на DTF',
    parsingMethod: 'rss',
    translateTitle: false,
    enabled: false
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf829'),
    site: 'DTF',
    section: 'PlayStation',
    url: 'https://dtf.ru/rss/s/playstation',
    regex: '^.*?dtf.ru\/s\/playstation\/\\d{7}.*$',
    removeInTitle: '— PlayStation на DTF',
    parsingMethod: 'rss',
    translateTitle: false,
    enabled: false
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf828'),
    site: 'DTF',
    section: 'VR & AR',
    url: 'https://dtf.ru/rss/s/vr_ar',
    regex: '^.*?dtf.ru\/s\/vr_ar\/\\d{7}.*$',
    removeInTitle: '— Все, что связанно с VR и AR на DTF',
    parsingMethod: 'rss',
    translateTitle: false,
    enabled: false
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf827'),
    site: 'Wccftech',
    section: 'News',
    url: 'https://feeds2.feedburner.com/Wccftechcom',
    regex: '^.*?wccftech.com\/[a-zA-Z0-9-]{1,200}\/$',
    removeInTitle: '/ NONE',
    parsingMethod: 'rss',
    translateTitle: true,
    enabled: false
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf826'),
    site: 'Videocardz',
    section: 'News',
    url: 'https://videocardz.com/',
    regex: '^.*?videocardz.com\/(newz|press-release)\/[a-zA-Z0-9-]{1,200}$',
    removeInTitle: '- VideoCardz.com',
    parsingMethod: 'html',
    translateTitle: true,
    enabled: true
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf825'),
    site: 'Overclockers',
    section: 'Hardnews',
    url: 'https://overclockers.ru/rss/hardnews.rss',
    regex: '^.*?overclockers.ru\/.*?\/show\/\\d{6}\/.*$',
    removeInTitle: 'Overclockers.ru:',
    parsingMethod: 'rss',
    translateTitle: false,
    enabled: false
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf824'),
    site: 'Overclockers',
    section: 'Блоги',
    url: 'https://overclockers.ru/rss/blog.rss',
    regex: '^.*?overclockers.ru\/blog\/.*?\/show\/\\d{6}\/.*$',
    removeInTitle: 'Overclockers.ru:',
    parsingMethod: 'rss',
    translateTitle: false,
    enabled: false
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf823'),
    site: 'Shazoo',
    section: 'Новости',
    url: 'https://shazoo.ru/feed/rss',
    regex: '^.*?shazoo.ru\/\\d{4}\/\\d{2}\/\\d{2}\/\\d{6}\/.*$',
    removeInTitle: '- Shazoo',
    parsingMethod: 'rss',
    translateTitle: false,
    enabled: true
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf822'),
    site: 'Tengrinews',
    section: 'Новости',
    url: 'https://tengrinews.kz/',
    regex: '^.*?tengrinews.kz\/.*?\/.*?-\\d{6}\/?$',
    removeInTitle: '- новости на Tengrinews.kz',
    parsingMethod: 'html',
    translateTitle: false,
    enabled: true
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf821'),
    site: 'Хабр',
    section: 'API',
    url: 'https://habr.com/ru/rss/hubs/api/articles/all/?fl=ru',
    regex: '^.*?habr.com\/ru\/.*?\/\\d{6}\/.*$',
    removeInTitle: '/ Хабр',
    parsingMethod: 'rss',
    translateTitle: false,
    enabled: false
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf820'),
    site: 'Хабр',
    section: 'CSS',
    url: 'https://habr.com/ru/rss/hubs/css/articles/all/?fl=ru',
    regex: '^.*?habr.com\/ru\/.*?\/\\d{6}\/.*$',
    removeInTitle: '/ Хабр',
    parsingMethod: 'rss',
    translateTitle: false,
    enabled: false
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf819'),
    site: 'Хабр',
    section: 'HTML',
    url: 'https://habr.com/ru/rss/hubs/html5/articles/all/?fl=ru',
    regex: '^.*?habr.com\/ru\/.*?\/\\d{6}\/.*$',
    removeInTitle: '/ Хабр',
    parsingMethod: 'rss',
    translateTitle: false,
    enabled: false
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf818'),
    site: 'Хабр',
    section: 'JavaScript',
    url: 'https://habr.com/ru/rss/hubs/javascript/articles/all/?fl=ru',
    regex: '^.*?habr.com\/ru\/.*?\/\\d{6}\/.*$',
    removeInTitle: '/ Хабр',
    parsingMethod: 'rss',
    translateTitle: false,
    enabled: false
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf817'),
    site: 'Хабр',
    section: 'MongoDB',
    url: 'https://habr.com/ru/rss/hubs/mongodb/articles/all/?fl=ru',
    regex: '^.*?habr.com\/ru\/.*?\/\\d{6}\/.*$',
    removeInTitle: '/ Хабр',
    parsingMethod: 'rss',
    translateTitle: false,
    enabled: false
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf816'),
    site: 'Хабр',
    section: 'NodeJS',
    url: 'https://habr.com/ru/rss/hubs/nodejs/articles/all/?fl=ru',
    regex: '^.*?habr.com\/ru\/.*?\/\\d{6}\/.*$',
    removeInTitle: '/ Хабр',
    parsingMethod: 'rss',
    translateTitle: false,
    enabled: false
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf815'),
    site: 'Хабр',
    section: 'ReactJS',
    url: 'https://habr.com/ru/rss/hubs/reactjs/articles/all/?fl=ru',
    regex: '^.*?habr.com\/ru\/.*?\/\\d{6}\/.*$',
    removeInTitle: '/ Хабр',
    parsingMethod: 'rss',
    translateTitle: false,
    enabled: false
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf814'),
    site: 'Хабр',
    section: 'Браузеры',
    url: 'https://habr.com/ru/rss/hubs/browsers/articles/all/?fl=ru',
    regex: '^.*?habr.com\/ru\/.*?\/\\d{6}\/.*$',
    removeInTitle: '/ Хабр',
    parsingMethod: 'rss',
    translateTitle: false,
    enabled: false
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf813'),
    site: 'Хабр',
    section: 'Браузер Chrome',
    url: 'https://habr.com/ru/rss/hubs/google_chrome/articles/all/?fl=ru',
    regex: '^.*?habr.com\/ru\/.*?\/\\d{6}\/.*$',
    removeInTitle: '/ Хабр',
    parsingMethod: 'rss',
    translateTitle: false,
    enabled: false
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf812'),
    site: 'Хабр',
    section: 'Браузер Firefox',
    url: 'https://habr.com/ru/rss/hubs/firefox/articles/all/?fl=ru',
    regex: '^.*?habr.com\/ru\/.*?\/\\d{6}\/.*$',
    removeInTitle: '/ Хабр',
    parsingMethod: 'rss',
    translateTitle: false,
    enabled: false
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf811'),
    site: 'Хабр',
    section: 'Веб-дизайн',
    url: 'https://habr.com/ru/rss/hubs/web_design/articles/all/?fl=ru',
    regex: '^.*?habr.com\/ru\/.*?\/\\d{6}\/.*$',
    removeInTitle: '/ Хабр',
    parsingMethod: 'rss',
    translateTitle: false,
    enabled: false
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf810'),
    site: 'Хабр',
    section: 'Интерфейсы',
    url: 'https://habr.com/ru/rss/hubs/ui/articles/all/?fl=ru',
    regex: '^.*?habr.com\/ru\/.*?\/\\d{6}\/.*$',
    removeInTitle: '/ Хабр',
    parsingMethod: 'rss',
    translateTitle: false,
    enabled: false
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf809'),
    site: 'Хабр',
    section: 'Лайфхаки',
    url: 'https://habr.com/ru/rss/hubs/lifehacks/articles/all/?fl=ru',
    regex: '^.*?habr.com\/ru\/.*?\/\\d{6}\/.*$',
    removeInTitle: '/ Хабр',
    parsingMethod: 'rss',
    translateTitle: false,
    enabled: false
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf808'),
    site: 'Хабр',
    section: 'Юзабилити',
    url: 'https://habr.com/ru/rss/hubs/usability/articles/all/?fl=ru',
    regex: '^.*?habr.com\/ru\/.*?\/\\d{6}\/.*$',
    removeInTitle: '/ Хабр',
    parsingMethod: 'rss',
    translateTitle: false,
    enabled: false
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf807'),
    site: 'Kwork',
    section: 'Разработка и IT',
    url: 'https://kwork.ru/projects?c=11',
    regex: '^.*?kwork.ru\/projects\/\\d{7}\/?$',
    removeInTitle: '– Kwork',
    parsingMethod: 'kwork',
    translateTitle: false,
    enabled: true
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf806'),
    site: 'Kwork',
    section: 'Дизайн',
    url: 'https://kwork.ru/projects?c=15',
    regex: '^.*?kwork.ru\/projects\/\\d{7}\/?$',
    removeInTitle: '– Kwork',
    parsingMethod: 'kwork',
    translateTitle: false,
    enabled: false
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf805'),
    site: 'Kwork',
    section: 'Тексты и переводы',
    url: 'https://kwork.ru/projects?c=5',
    regex: '^.*?kwork.ru\/projects\/\\d{7}\/?$',
    removeInTitle: '– Kwork',
    parsingMethod: 'kwork',
    translateTitle: false,
    enabled: false
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf804'),
    site: 'Kwork',
    section: 'Трафик и SEO',
    url: 'https://kwork.ru/projects?c=17',
    regex: '^.*?kwork.ru\/projects\/\\d{7}\/?$',
    removeInTitle: '– Kwork',
    parsingMethod: 'kwork',
    translateTitle: false,
    enabled: false
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf803'),
    site: 'Kwork',
    section: 'Соцсети и реклама',
    url: 'https://kwork.ru/projects?c=45',
    regex: '^.*?kwork.ru\/projects\/\\d{7}\/?$',
    removeInTitle: '– Kwork',
    parsingMethod: 'kwork',
    translateTitle: false,
    enabled: false
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf802'),
    site: 'Kwork',
    section: 'Аудио и видео',
    url: 'https://kwork.ru/projects?c=7',
    regex: '^.*?kwork.ru\/projects\/\\d{7}\/?$',
    removeInTitle: '– Kwork',
    parsingMethod: 'kwork',
    translateTitle: false,
    enabled: false
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf801'),
    site: 'Kwork',
    section: 'Бизнес и жизнь',
    url: 'https://kwork.ru/projects?c=83',
    regex: '^.*?kwork.ru\/projects\/\\d{7}\/?$',
    removeInTitle: '– Kwork',
    parsingMethod: 'kwork',
    translateTitle: false,
    enabled: false
  },
  {
    _id: new mongoose.Types.ObjectId('653c0e405c01c8a5f7fcf901'),
    site: 'Freelancer',
    section: 'Selected Skills',
    url: 'https://www.freelancer.com/jobs/nodejs_windows_web-scraping_javascript_expressjs_api_mongodb/?results=100&languages=en,ru',
    regex: '^.*?freelancer.com\/projects\/.*?\/.*?$',
    removeInTitle: '| Freelancer',
    parsingMethod: 'html',
    translateTitle: false,
    enabled: true
  },
];

const users = [
  {
    _id: new mongoose.Types.ObjectId('653c0cf45ee6cc2579ff3405'),
    email: 'spider@gmail.com',
    password: 'password123!',
    bannedStrings: [],
    admin: true
  },
  {
    _id: new mongoose.Types.ObjectId('653c0cf45ee6cc2579ff3404'),
    email: 'grogu@gmail.com',
    password: 'password123!',
    bannedStrings: [],
    admin: true
  },
  {
    _id: new mongoose.Types.ObjectId('653c0cf45ee6cc2579ff3403'),
    email: 'mandalorian@gmail.com',
    password: 'password123!',
    bannedStrings: []
  },
  {
    _id: new mongoose.Types.ObjectId('653c0cf45ee6cc2579ff3402'),
    email: 'bokatan@gmail.com',
    password: 'password123!',
    bannedStrings: []
  },
  {
    _id: new mongoose.Types.ObjectId('653c0cf45ee6cc2579ff3401'),
    email: 'gideon@gmail.com',
    password: 'password123!',
    bannedStrings: []
  }
];

module.exports = {
  sources,
  users,
};
