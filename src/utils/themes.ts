const dark = 'dark';
const light = 'light';

function getBodyElement() {
  return document.getElementsByTagName('body')[0];
}

function forceDarkTheme() {
  getBodyElement().classList.add(dark);
  getBodyElement().classList.remove(light);
  localStorage.theme = dark;
}

function forceLightTheme() {
  getBodyElement().classList.add(light);
  getBodyElement().classList.remove(dark);
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
  const bodyElement = getBodyElement();
  const bodyClassesString = Array.from(bodyElement.classList).join(' ');
  const currentTheme = bodyClassesString.replace(/(?!(dark|light)\b)\b\w+\b|\s+/g, '');

  if (currentTheme) {
    return;
  }

  const storageTheme = localStorage.getItem('theme');
  
  if (storageTheme) {
    bodyElement.classList.add(storageTheme);
  }
}

export {
  toggleTheme,
  restorePageThemeFromStorage
};
