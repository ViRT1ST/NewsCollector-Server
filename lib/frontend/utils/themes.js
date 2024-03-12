const dark = 'dark';
const light = 'light';

const getHtmlElement = () => document.getElementsByTagName('html')[0];

const forceDarkTheme = () => {
  getHtmlElement().classList.add(dark);
  getHtmlElement().classList.remove(light);
  localStorage.theme = dark;
};

const forceLightTheme = () => {
  getHtmlElement().classList.add(light);
  getHtmlElement().classList.remove(dark);
  localStorage.theme = light;
};

const toggleTheme = () => {
  localStorage.getItem('theme') === dark
    ? forceLightTheme()
    : forceDarkTheme();
};

const restorePageThemeFromStorage = () => {
  if (!window || !document) {
    return;
  }

  // important: must be space in join() method
  const bodyClassList = getHtmlElement().classList;
  const bodyClassName = Array.from(bodyClassList).join(' ');
  const bodyTheme = bodyClassName.replace(/(?!(dark|light)\b)\b\w+\b|\s+/g, '');

  if (bodyTheme) {
    return;
  }

  const storageTheme = localStorage.getItem('theme');
  getHtmlElement().classList.add(storageTheme);
};

export {
  toggleTheme,
  restorePageThemeFromStorage,
};
