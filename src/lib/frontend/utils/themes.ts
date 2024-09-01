const dark = 'dark';
const light = 'light';

function getHtmlElement() {
  return document.getElementsByTagName('html')[0];
}

function forceDarkTheme() {
  getHtmlElement().classList.add(dark);
  getHtmlElement().classList.remove(light);
  localStorage.theme = dark;
}

function forceLightTheme() {
  getHtmlElement().classList.add(light);
  getHtmlElement().classList.remove(dark);
  localStorage.theme = light;
}

function toggleTheme() {
  localStorage.getItem('theme') === dark
    ? forceLightTheme()
    : forceDarkTheme();
}

function restorePageThemeFromStorage() {
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
  
  if (storageTheme) {
    getHtmlElement().classList.add(storageTheme);
  }
}

export {
  toggleTheme,
  restorePageThemeFromStorage
};
