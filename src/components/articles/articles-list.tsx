'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ArticleAtClient } from '@/types';
import { articlesApi } from '@/lib/redux/apis';
import { formatQueryResults } from '@/utils/redux';
import { classesBeautify } from '@/utils/styles';
import { sortArticlesByDate, sortArticlesBySite } from '@/utils/articles';
import { getCookies, setCookies } from '@/utils/cookies';
import ArticleItem from '@/components/articles/articles-list-item';
import Spinner from '@/components/[common-ui]/spinner';
import ErrorMessage from '@/components/[common-ui]/error-message';
import ArticlesListButton from '@/components/articles/articles-list-button';

export const dynamic = 'force-dynamic';

type Props = {
  page: string;
  noArticlesMsg: string;
};

export default function ArticlesList({ page, noArticlesMsg }: Props) {
  const dispatch = useDispatch();

  const { data: response, error, isFetching, refetch } = articlesApi.useFetchArticlesQuery(page);
  const { success, code, data, message } = formatQueryResults(response, error);

  const [ articles, setArticles ] = useState<ArticleAtClient[]>([]);
  const [ autoRefreshAtZero, setAutoRefreshAtZero ] = useState(true);

  useEffect(() => {
    if (!isFetching && success) {
      if (data && data.length !== 0) {
        setArticles(data);
        
        const sorting = getCookies()['articles-sorting'];
        sortArticles(sorting, false);

        setAutoRefreshAtZero(true);
      }

      return () => {
        dispatch(articlesApi.util.resetApiState());
      };
    }

  }, [isFetching, success]);

  useEffect(() => {
    if (articles.length === 0 && autoRefreshAtZero) {
      refreshList();
      setAutoRefreshAtZero(false);
    }

  }, [articles]);

  function refreshList() {
    setArticles([]);
    refetch();
  }

  function sortArticles(sorting: string, createCookie = true) {
    const array = articles.length !== 0 ? [...articles] : [...data];

    if (sorting === 'date-asc') {
      setArticles(sortArticlesByDate(array, 'asc'));
      createCookie && setCookies({ 'articles-sorting': 'date-asc' });

    } else if (sorting === 'date-desc') {
      setArticles(sortArticlesByDate(array, 'desc'));
      createCookie && setCookies({ 'articles-sorting': 'date-desc' });

    } else if (sorting === 'site-asc') {
      setArticles(sortArticlesBySite(array, 'asc'));
      createCookie && setCookies({ 'articles-sorting': 'site-asc' });

    } else if (sorting === 'site-desc') {
      setArticles(sortArticlesBySite(array, 'desc'));
      createCookie && setCookies({ 'articles-sorting': 'site-desc' });
    }
  }

  async function removeArticleFromList(articleUuid: string) {
    const newArticles = articles.filter((item) => item.uuid !== articleUuid);
    setArticles(newArticles);
  };

  function renderContent() {
    if (isFetching) {
      return (
        <Spinner />
      );
    }
  
    if (message) {
      return (
        <ErrorMessage code={code} message={message} />
      );
    }
  
    if (success && articles.length === 0) {
      return (
        <p className={twNoNewsMessage}>
          {noArticlesMsg}
        </p>
      );
    }
    
    return (
      <>
        <div className={twListHeaderContainer}>
          <div className={twListHeaderItem}>
            <span className={twListHeaderItemText}>
              {articles.length} LINKS IN CURRENT LIST
            </span>
            <ArticlesListButton onClick={refreshList} white={true}>
              REFRESH
            </ArticlesListButton>
          </div>

          <div className={twListHeaderItem}>
            <span className={twListHeaderItemText}>
              SORT BY SITE
            </span>
            <ArticlesListButton onClick={() => sortArticles('site-asc')} white={true}>
              ASC
            </ArticlesListButton>
            <ArticlesListButton onClick={() => sortArticles('site-desc')} white={true}>
              DESC
            </ArticlesListButton>
          </div>

          <div className={twListHeaderItem}>
            <span className={twListHeaderItemText}>
              SORT BY DATE
            </span>
            <ArticlesListButton onClick={() => sortArticles('date-asc')} white={true}>
              ASC
            </ArticlesListButton>
            <ArticlesListButton onClick={() => sortArticles('date-desc')} white={true}>
              DESC
            </ArticlesListButton>
          </div>
        </div>

        <ul>
          {articles.map((article) => (
            <li key={article.uuid}>
              <ArticleItem
                article={article}
                page={page}
                onRemoveFromList={removeArticleFromList}
              />
            </li>
          ))}
        </ul>
      </>
    ); 
  }

  return renderContent();
}

const twListHeaderContainer = classesBeautify(`
  flex justify-between py-1.5 w-full
  border rounded border-transparent
  flex-col lg:flex-row
  gap-4 lg:gap-8
  mb-4 2xl:mb-2
`);

const twListHeaderItem = classesBeautify(`
  flex flex-row items-center
  justify-end lg:justify-end lg:first:justify-start 
  first:flex-grow
`);

const twListHeaderItemText = classesBeautify(`
  font-roboto text-[0.8rem] font-medium
  text-lt-btn-default-fg dark:text-white/50
`);

const twNoNewsMessage = classesBeautify(`
  mt-8 px-6
  font-roboto text-xl text-center whitespace-pre
  animate-fade-in
  text-lt-page-fg/60 dark:text-dt-page-fg/40
`);
