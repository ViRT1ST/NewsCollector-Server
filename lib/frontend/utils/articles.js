const convertDateToAgo = (isoTime) => {
  const date = new Date(isoTime);
  const now = new Date();

  const secondsHavePassed = Math.round((now.getTime() - date.getTime()) / 1000);

  const hours = Math.floor(secondsHavePassed / 3600);
  const minutes = Math.floor((secondsHavePassed - hours * 3600) / 60);

  const locales = 'en-US';
  const options =  { minimumIntegerDigits: 2, useGrouping: false };
  const h = hours.toLocaleString(locales, options);
  const m = minutes.toLocaleString(locales, options);

  return h > 100 ? '100hrs+ ago' : `${h}h:${m}m ago`;
};

const hideElementWithCollapsing = async (ref) => {
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const element = ref.current;

  element.style.cssText = `
    transform-origin: bottom center;
    transition: all 250ms ease;
    margin: 0;

    max-height: ${element.offsetHeight}px;
    transform: scaleY(1);
    opacity: 1;
  `;

  await sleep(50);

  element.style.cssText += `
    max-height: 0;
    transform: scaleY(0);
    opacity: 0;
  `;
};

export {
  convertDateToAgo,
  hideElementWithCollapsing
};
