'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ArticleAtClient } from '@/types';
import { articlesApi } from '@/lib/redux/apis';
import { formatQueryResults } from '@/utils/redux';
import { classesBeautify } from '@/utils/styles';
import { sortArticles } from '@/utils/articles';
import { getCookies, setCookies } from '@/utils/cookies';
import ArticleItem from '@/components/articles/articles-list-item';
import Spinner from '@/components/[common-ui]/spinner';
import ErrorMessage from '@/components/[common-ui]/error-message';
import ArticlesControls from '@/components/articles/articles-controls';

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
        const sorting = getCookies()['articles-sorting'];
        const sortedArticles = sortArticles(data, sorting);
        setArticles(sortedArticles);
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
  }, [articles.length]);

  function refetchArticles() {
    setTimeout(() => {
      setArticles([]);
      refetch();
    }, 300);
  }

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
          <ArticlesControls
            quantity={articles.length}
            refetch={refetchArticles}
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
