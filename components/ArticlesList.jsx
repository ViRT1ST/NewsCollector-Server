'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import tw from 'tailwind-styled-components';

import { useFetchArticlesQuery } from '@/lib/frontend/store';
import { articlesApi } from '@/lib/frontend/store/apis/backend';
import ArticleItem from '@/components/ArticleItem';
import Spinner from '@/components/Spinner';
import ErrorMessage from '@/components/ErrorMessage';

const ArticlesPage = ({ page, noArticlesMsg }) => {
  const dispatch = useDispatch();

  const { data: response, error, isFetching } = useFetchArticlesQuery(page);
  const [count, setCount] = useState();

  useEffect(() => {
    const dataLength = response?.data?.length;

    if (typeof dataLength === 'number') {
      setCount(dataLength);
    }

    return () => {
      if (response) {
        dispatch(articlesApi.util.resetApiState());
      }
    };
  }, [response?.success]);

  if (isFetching) {
    return (
      <Spinner />
    );
  }

  if (error) {
    const { status, data: { message } } = error;
    return (
      <ErrorMessage code={status} message={message} />
    );
  }

  if (count === 0) {
    return (
      <NoNewsMessage>{noArticlesMsg}</NoNewsMessage>
    );
  }

  return (
    <ul>
      {response.data.map((article) => (
        <li key={article._id}>
          <ArticleItem
            article={article}
            onCountDecrease={() => setCount((current) => current - 1)}
            page={page}
          />
        </li>
      ))}
    </ul>
  ); 
};

const NoNewsMessage = tw.p`
  text-lt-page-fg/60 dark:text-dt-page-fg/40

  mt-8 px-6
  font-roboto text-xl text-center
  whitespace-pre

  animate-fade-in
`;

export default ArticlesPage;
