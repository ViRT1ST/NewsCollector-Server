function convertDateToAgo(time: Date | string) {
  const date = new Date(time);
  const now = new Date();

  const secondsHavePassed = Math.round((now.getTime() - date.getTime()) / 1000);

  const hours = Math.floor(secondsHavePassed / 3600);
  const minutes = Math.floor((secondsHavePassed - hours * 3600) / 60);

  const locales = 'en-US';
  const options =  { minimumIntegerDigits: 2, useGrouping: false };
  const h = hours.toLocaleString(locales, options);
  const m = minutes.toLocaleString(locales, options);

  return parseInt(h) > 100 ? '100hrs+ ago' : `${h}h:${m}m ago`;
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function hideElementWithCollapsing(ref: React.RefObject<HTMLElement>) {
  if (ref.current) {
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
  }
}

export {
  convertDateToAgo,
  hideElementWithCollapsing
};
