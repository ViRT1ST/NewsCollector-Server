import { ArticleAtClient, ArticleAtClientWithDateObject } from '@/types';

type tempArticlesType = ArticleAtClient[] | ArticleAtClientWithDateObject[]
type Direction = 'asc' | 'desc'

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

function convertArticlesWithStringDatesToObjectDates(articles: ArticleAtClient[]) {
  return articles.map((item) => ({ ...item, created_at: new Date(item.created_at) }));
}

function convertArticlesWithObjectDatesToStringDates(articles: ArticleAtClientWithDateObject[]) {
  return articles.map((item) => ({ ...item, created_at: item.created_at.toISOString()}));
}

function sortArticlesByTitle(articles: ArticleAtClient[]) {
  let newArticles: ArticleAtClient[] = [...articles];
  return newArticles.sort((a, b) => a.title.localeCompare(b.title));
}

export function sortArticlesByDate(articles: ArticleAtClient[], direction: Direction) {
  let newArticles: tempArticlesType = [...articles];

  newArticles = sortArticlesByTitle(newArticles);
  newArticles = convertArticlesWithStringDatesToObjectDates(newArticles);

  if (direction === 'asc') {
    newArticles = newArticles.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
  } else {
    newArticles = newArticles.sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
  }
  
  newArticles = convertArticlesWithObjectDatesToStringDates(newArticles);

  return newArticles;
}

export function sortArticlesBySite(articles: ArticleAtClient[], direction: Direction) {
  let newArticles: ArticleAtClient[] = [...articles];

  newArticles = sortArticlesByTitle(newArticles);

  if (direction === 'asc') {
    newArticles = newArticles.sort((a, b) => a.site.localeCompare(b.site));
  } else {
    newArticles = newArticles.sort((a, b) => b.site.localeCompare(a.site));
  }

  return newArticles;
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function hideElementWithCollapsing(ref: React.RefObject<HTMLElement>) {
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
