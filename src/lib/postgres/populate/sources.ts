export const defaultSources = [
  {
    uuid: 'ea12cd10-be78-49f6-b10a-0e1640b8e40f',
    site: 'Tengrinews',
    section: 'Новости',
    url: 'https://tengrinews.kz/',
    parsing_method: 'html',
    regex: '^.*?tengrinews.kz/.*?/.*?-\\d{6}/?$',
    remove_in_title: '- новости на Tengrinews.kz',
    translate_title: false,
    enabled: true,
  },
  {
    uuid: '749ce078-70c2-46e1-b5e6-98b1dad9a326',
    site: 'Shazoo',
    section: 'Новости',
    url: 'https://shazoo.ru/feed/rss',
    parsing_method: 'rss',
    regex: '^.*?shazoo.ru/\\d{4}/\\d{2}/\\d{2}/\\d{6}/.*$',
    remove_in_title: '- Shazoo',
    translate_title: false,
    enabled: true,
  },
  {
    uuid: '9d0aee7c-9bb9-450c-b073-28c91289ec8a',
    site: 'Wccftech',
    section: 'News',
    url: 'https://feeds2.feedburner.com/Wccftechcom',
    parsing_method: 'rss',
    regex: '^.*?wccftech.com/[a-zA-Z0-9-]{1,200}/$',
    remove_in_title: '/ NONE',
    translate_title: true,
    enabled: true,
  },
  {
    uuid: '55a2c33e-dd00-463f-aaaf-911036993274',
    site: 'Kwork',
    section: 'Разработка и IT',
    url: 'https://kwork.ru/projects?c=11',
    parsing_method: 'kwork',
    regex: '^.*?kwork.ru/projects/\\d{7}/?$',
    remove_in_title: '– Kwork',
    translate_title: false,
    enabled: true,
  },
  {
    uuid: '16cf9dcf-08a9-47c0-a372-8a06b78ef167',
    site: 'Freelancer',
    section: 'Selected Skills',
    url: 'https://www.freelancer.com/jobs/nodejs_javascript_expressjs_api_nextjs_webdev_react-js_web-development_frontend-development_typescript_postgresql_rest-api/?results=100&languages=en',
    parsing_method: 'html',
    regex: '^.*?freelancer.com/projects/.*?/.*?$',
    remove_in_title: '| Freelancer',
    translate_title: false,
    enabled: true,
  },
  {
    uuid: 'f26ff7d3-eba0-447e-a611-33efb1faea85',
    site: 'Videocardz',
    section: 'News',
    url: 'https://videocardz.com/',
    parsing_method: 'html',
    regex: '^.*?videocardz.com/(newz|press-release)/[a-zA-Z0-9-]{1,200}$',
    remove_in_title: '- VideoCardz.com',
    translate_title: false,
    enabled: false,
  },
  {
    uuid: '5564ad1e-d91b-49b9-9dd2-2fe5c28f0e2d',
    site: 'Хабр',
    section: 'API',
    url: 'https://habr.com/ru/rss/hubs/api/articles/all/?fl=ru',
    parsing_method: 'rss',
    regex: '^.*?habr.com/ru/.*?/\\d{6}/.*$',
    remove_in_title: '/ Хабр',
    translate_title: false,
    enabled: false,
  },
  {
    uuid: '50d2727a-fc1e-4b5a-9873-bfcf2a7bcbec',
    site: 'Хабр',
    section: 'CSS',
    url: 'https://habr.com/ru/rss/hubs/css/articles/all/?fl=ru',
    parsing_method: 'rss',
    regex: '^.*?habr.com/ru/.*?/\\d{6}/.*$',
    remove_in_title: '/ Хабр',
    translate_title: false,
    enabled: false,
  },
  {
    uuid: 'c5307643-975c-400f-aa0c-4505433bde63',
    site: 'Хабр',
    section: 'HTML',
    url: 'https://habr.com/ru/rss/hubs/html5/articles/all/?fl=ru',
    parsing_method: 'rss',
    regex: '^.*?habr.com/ru/.*?/\\d{6}/.*$',
    remove_in_title: '/ Хабр',
    translate_title: false,
    enabled: false,
  },
  {
    uuid: '995f2ffd-e97e-48c5-aa43-5e2be502c773',
    site: 'Хабр',
    section: 'JavaScript',
    url: 'https://habr.com/ru/rss/hubs/javascript/articles/all/?fl=ru',
    parsing_method: 'rss',
    regex: '^.*?habr.com/ru/.*?/\\d{6}/.*$',
    remove_in_title: '/ Хабр',
    translate_title: false,
    enabled: false,
  },
  {
    uuid: '76c0a145-6f45-4433-b1ab-87d5c82c76a8',
    site: 'Хабр',
    section: 'NodeJS',
    url: 'https://habr.com/ru/rss/hubs/nodejs/articles/all/?fl=ru',
    parsing_method: 'rss',
    regex: '^.*?habr.com/ru/.*?/\\d{6}/.*$',
    remove_in_title: '/ Хабр',
    translate_title: false,
    enabled: false,
  },
  {
    uuid: '5c52d983-ff47-411b-8278-6711f29aeff7',
    site: 'Хабр',
    section: 'ReactJS',
    url: 'https://habr.com/ru/rss/hubs/reactjs/articles/all/?fl=ru',
    parsing_method: 'rss',
    regex: '^.*?habr.com/ru/.*?/\\d{6}/.*$',
    remove_in_title: '/ Хабр',
    translate_title: false,
    enabled: false,
  },
  {
    uuid: '65ed79bd-0471-46a2-a8b0-1e30dcfb8e5e',
    site: 'Хабр',
    section: 'Браузеры',
    url: 'https://habr.com/ru/rss/hubs/browsers/articles/all/?fl=ru',
    parsing_method: 'rss',
    regex: '^.*?habr.com/ru/.*?/\\d{6}/.*$',
    remove_in_title: '/ Хабр',
    translate_title: false,
    enabled: false,
  },
  {
    uuid: 'bae06d8d-f438-46a4-98a1-4f964cbaf0d9',
    site: 'Хабр',
    section: 'Браузер Chrome',
    url: 'https://habr.com/ru/rss/hubs/google_chrome/articles/all/?fl=ru',
    parsing_method: 'rss',
    regex: '^.*?habr.com/ru/.*?/\\d{6}/.*$',
    remove_in_title: '/ Хабр',
    translate_title: false,
    enabled: false,
  },
  {
    uuid: 'ca247523-b145-430b-b792-807836f3eaf0',
    site: 'Хабр',
    section: 'Браузер Firefox',
    url: 'https://habr.com/ru/rss/hubs/firefox/articles/all/?fl=ru',
    parsing_method: 'rss',
    regex: '^.*?habr.com/ru/.*?/\\d{6}/.*$',
    remove_in_title: '/ Хабр',
    translate_title: false,
    enabled: false,
  },
  {
    uuid: 'a05b6e4f-2274-4366-b5f5-5737f29cabe6',
    site: 'Хабр',
    section: 'Веб-дизайн',
    url: 'https://habr.com/ru/rss/hubs/web_design/articles/all/?fl=ru',
    parsing_method: 'rss',
    regex: '^.*?habr.com/ru/.*?/\\d{6}/.*$',
    remove_in_title: '/ Хабр',
    translate_title: false,
    enabled: false,
  },
  {
    uuid: '771437c8-f16e-4385-8680-f655dd6004f9',
    site: 'Хабр',
    section: 'Интерфейсы',
    url: 'https://habr.com/ru/rss/hubs/ui/articles/all/?fl=ru',
    parsing_method: 'rss',
    regex: '^.*?habr.com/ru/.*?/\\d{6}/.*$',
    remove_in_title: '/ Хабр',
    translate_title: false,
    enabled: false,
  },
  {
    uuid: 'e3be9fe6-d786-4f8a-849c-bff33ce6465a',
    site: 'Хабр',
    section: 'Лайфхаки',
    url: 'https://habr.com/ru/rss/hubs/lifehacks/articles/all/?fl=ru',
    parsing_method: 'rss',
    regex: '^.*?habr.com/ru/.*?/\\d{6}/.*$',
    remove_in_title: '/ Хабр',
    translate_title: false,
    enabled: false,
  },
  {
    uuid: 'a7520754-c997-44aa-9d88-66e92fb80d43',
    site: 'Хабр',
    section: 'Юзабилити',
    url: 'https://habr.com/ru/rss/hubs/usability/articles/all/?fl=ru',
    parsing_method: 'rss',
    regex: '^.*?habr.com/ru/.*?/\\d{6}/.*$',
    remove_in_title: '/ Хабр',
    translate_title: false,
    enabled: false,
  },
];
