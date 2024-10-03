import { ArticleAtClient, ArticleAtClientWithDateObject } from '@/types';

/* =============================================================
Sorting
============================================================= */

type Direction = 'asc' | 'desc'

function sortArticlesByTitle(articles: ArticleAtClient[]) {
  articles.sort((a, b) => a.title.localeCompare(b.title));
}

function sortArticlesByDate(articles: ArticleAtClient[], direction: Direction) {
  articles.sort((a, b) => {
    if (direction === 'asc') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
  });
}

function sortArticlesBySite(articles: ArticleAtClient[], direction: Direction) {
  articles.sort((a, b) => {
    if (direction === 'asc') {
      return a.site.localeCompare(b.site);
    } else {
      return b.site.localeCompare(a.site);
    }
  });
}

export function sortArticles(articles: ArticleAtClient[], sorting: string | null) {
  if (articles.length !== 0) {
    const newArticles = [...articles];
    
    sortArticlesByTitle(newArticles);

    if (sorting === 'date-asc') {
      sortArticlesByDate(newArticles, 'asc');
    } else if (sorting === 'date-desc') {
      sortArticlesByDate(newArticles, 'desc');
    } else if (sorting === 'site-asc') {
      sortArticlesBySite(newArticles, 'asc');
    } else if (sorting === 'site-desc') {
      sortArticlesBySite(newArticles, 'desc');
    } 

    return newArticles;
  }
}

/* =============================================================
Other
============================================================= */

export function convertDateToAgo(time: Date | string) {
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

export async function hideElementWithCollapsing(ref: React.RefObject<HTMLElement>) {
  const sleep = async (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

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

    await sleep(250);
  }
}