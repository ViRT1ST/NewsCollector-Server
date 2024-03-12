'use client';

import tw from 'tailwind-styled-components';
import { useState, useEffect, useRef } from 'react';
import useSWR, { mutate } from 'swr';

import { getArticlesRequest } from '@/lib/frontend/requests';
import ArticleItem from '@/components/ArticleItem';
import Spinner from '@/components/Spinner';
import ErrorMessage from '@/components/ErrorMessage';

const ArticlesList = ({ page, noArticlesMsg }) => {
  const [count, setCount] = useState();

  const random = useRef(Date.now());
  const { key, fetcher } = getArticlesRequest(page);
  const { data: response, isLoading } = useSWR([key, random], fetcher);
  const { status, message, data } = response || {};

  useEffect(() => {
    const dataLength = data?.length;

    if (typeof dataLength === 'number') {
      setCount(dataLength);
    }
  }, [response]);

  const updateCount = () => {
    setCount((current) => current - 1);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (message) {
    return <ErrorMessage code={status} message={message} />;
  }

  if (count === 0) {
    return <NoNewsMessage>{noArticlesMsg}</NoNewsMessage>;
  }

  return (
    <ul>
      {data.map((article) => (
        <li key={article._id}>
          <ArticleItem article={article} updateCount={updateCount} page={page}/>
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

export default ArticlesList;
