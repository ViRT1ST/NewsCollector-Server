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
  const [ mustRefreshOnZero, setMustRefreshOnZero ] = useState(true);

  useEffect(() => {
    if (!isFetching) {
      if (data && data.length !== 0) {
        setArticles(data);
        setMustRefreshOnZero(true);
      } else {
        setArticles([]);
        setMustRefreshOnZero(false);
      }

      return () => {
        dispatch(articlesApi.util.resetApiState());
      };
    }
  }, [isFetching]);

  useEffect(() => {
    if (articles.length === 0 && mustRefreshOnZero && !isFetching) {
      refetchArticles();
    }

    // sort articles after receiving data
    if (articles.length === data?.length) {
      const sorting = getCookies()['articles-sorting'];
      sortArticles(sorting, false);
    }
  }, [articles.length]);

  function refetchArticles() {
    setTimeout(() => refetch(), 300);
  }

  function sortArticles(sorting: string | null, createCookie = true) {
    if (articles.length !== 0) {
      if (sorting === 'date-asc') {
        setArticles(sortArticlesByDate(articles, 'asc'));
        createCookie && setCookies({ 'articles-sorting': 'date-asc' });
  
      } else if (sorting === 'date-desc') {
        setArticles(sortArticlesByDate(articles, 'desc'));
        createCookie && setCookies({ 'articles-sorting': 'date-desc' });
  
      } else if (sorting === 'site-asc') {
        setArticles(sortArticlesBySite(articles, 'asc'));
        createCookie && setCookies({ 'articles-sorting': 'site-asc' });
  
      } else if (sorting === 'site-desc') {
        setArticles(sortArticlesBySite(articles, 'desc'));
        createCookie && setCookies({ 'articles-sorting': 'site-desc' });
      }
    };
  }

  async function removeArticleFromList(articleUuid: string) {
    setArticles((prev) => prev.filter((item) => item.uuid !== articleUuid));
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
  
    if (articles.length === 0 && !mustRefreshOnZero) {
      return (
        <p className={twNoNewsMessage}>
          {noArticlesMsg}
        </p>
      );
    }

    if (success && articles.length !== 0) {
      return (
        <>
          <div className={twListHeaderContainer}>
            <div className={twListHeaderItem}>
              <span className={twListHeaderItemText}>
                {articles.length} LINKS IN CURRENT LIST
              </span>
              <ArticlesListButton onClick={refetchArticles} white={true}>
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
    
    return null;
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
