import { getCookies } from './utils/cookies';
import { useRef } from 'react';

const getFetcher = (url, options) => {
  return async () => {
    const res = await fetch(url, options);
    return await res.json();
  };
};

const getArticlesRequest = (articlesType) => {
  const url = `http://localhost:3000/api/articles?find=${articlesType}`;

  const options = {
    cache: 'no-cache',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getCookies().token}`
    }
  };

  return {
    key: url,
    fetcher: getFetcher(url, options)
  };
};

const saveArticle = (id) => {
  const url = `http://localhost:3000/api/articles/${id}/save`;

  const options = {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${getCookies().token}`
    }
  };

  return {
    key: url,
    fetcher: getFetcher(url, options)
  };
};


export {
  getArticlesRequest,
  saveArticle
};