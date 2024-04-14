'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import tw from 'tailwind-styled-components';

import { useFetchArticlesQuery } from '@/lib/frontend/store';
import { articlesApi } from '@/lib/frontend/store/apis/backend';
import { getApiResponse } from '@/lib/frontend/utils/api';
import { ArticleAtClient } from '@/lib/types';
import ArticleItem from '@/components/ArticleItem';
import Spinner from '@/components/Spinner';
import ErrorMessage from '@/components/ErrorMessage';

export const dynamic = 'force-dynamic';

export default function ArticlesList({
  page,
  noArticlesMsg
}: {
  page: string;
  noArticlesMsg: string;
}) {
  const dispatch = useDispatch();

  const { data: response, error, isFetching } = useFetchArticlesQuery(page);
  const { success, code, data, message } = getApiResponse(response, error);

  const [count, setCount] = useState(0);
  const [articles, setArticles] = useState<ArticleAtClient[]>([]);

  useEffect(() => {
    if (success) {
      setCount(data.length);
      setArticles(data);

      return () => {
        dispatch(articlesApi.util.resetApiState());
      };
    }

  }, [success]);

  function decreaseCount() {
    setCount((current) => current - 1);
  };

  function renderContent() {
    if (isFetching) {
      return <Spinner />;
    }
  
    if (message) {
      return <ErrorMessage code={code} message={message} />;
    }
  
    if (success && count === 0) {
      return <NoNewsMessage>{noArticlesMsg}</NoNewsMessage>;
    }
  
    return (
      <ul>
        {articles.map((article) => (
          <li key={article.uuid}>
            <ArticleItem article={article} page={page} onCountDecrease={decreaseCount} />
          </li>
        ))}
      </ul>
    ); 
  }

  return renderContent();
}

const NoNewsMessage = tw.p`
  text-lt-page-fg/60 dark:text-dt-page-fg/40

  mt-8 px-6
  font-roboto text-xl text-center
  whitespace-pre

  animate-fade-in
`;
