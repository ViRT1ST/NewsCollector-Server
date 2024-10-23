'use client';

import { useState, useEffect } from 'react';

import { type ArticleAtClient } from '@/types';
import { classesBeautify } from '@/utils/styles';
import { getCookies, setCookies } from '@/utils/cookies';
import { sortArticles } from '@/utils/articles';
import { useGetArticles } from '@/hooks/api';
import { FetchError } from '@/utils/errors';
import ArticlesControls from '@/components/articles/articles-controls';
import ArticleItem from '@/components/articles/articles-list-item';
import Spinner from '@/components/[common-ui]/spinner';
import ErrorMessage from '@/components/[common-ui]/error-message';

type Props = {
  page: string;
  noArticlesMsg: string;
};

export default function ArticlesList({ page, noArticlesMsg }: Props) {
  const { data, isFetching, isSuccess, error, refetch } = useGetArticles(page);

  const [ articles, setArticles ] = useState<ArticleAtClient[]>([]);

  const [ mustRefreshOnZero, setMustRefreshOnZero ] = useState(true);

  useEffect(() => {
    if (!isFetching && isSuccess) {
      const fetchedArticles = data?.data || [];

      if (fetchedArticles.length !== 0) {
        const sorting = getCookies()['articles-sorting'];
        const sortedArticles = sortArticles(fetchedArticles, sorting);

        setArticles(sortedArticles);
        setMustRefreshOnZero(true);
      } else {
        setArticles([]);
        setMustRefreshOnZero(false);
      }
    }
  
  }, [isFetching, isSuccess, data]);

  // automatic one-time refetching on zero articles 
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mustRefreshOnZero && !isFetching && articles.length === 0) {
        refetch();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [articles.length, mustRefreshOnZero, isFetching, refetch]);


  function handleSortingButtonClick(sorting: string | null, createCookie = true) {
    if (articles.length !== 0) {
      createCookie && setCookies({ 'articles-sorting': sorting });
      const sortedArticles = sortArticles(articles, sorting);
      setArticles(sortedArticles);
    }
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

    if (error) {
      const { code, message } = error as FetchError;
      return (
        <ErrorMessage code={code} message={message} />
      );
    }

    if (isSuccess && articles.length === 0 && !mustRefreshOnZero) {
      return (
        <p className={twNoNewsMessage}>
          {noArticlesMsg}
        </p>
      );
    }

    if (isSuccess && articles.length !== 0) {
      return (
        <>
          <ArticlesControls
            quantity={articles.length}
            refetch={refetch}
            sort={handleSortingButtonClick}
          />
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

const twNoNewsMessage = classesBeautify(`
  mt-8 px-6
  font-roboto text-xl text-center whitespace-pre
  animate-fade-in
  text-lt-page-fg/60 dark:text-dt-page-fg/40
`);
