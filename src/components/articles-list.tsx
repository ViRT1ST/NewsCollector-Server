'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { articlesApi } from '@/lib/redux/apis';
import { formatQueryResults } from '@/utils/redux';
import { classesBeautify } from '@/utils/styles';
import { ArticleAtClient } from '@/types';
import ArticleItem from '@/components/article-item';
import Spinner from '@/components/[common-ui]/spinner';
import ErrorMessage from '@/components/[common-ui]/error-message';

export const dynamic = 'force-dynamic';

type Props = {
  page: string;
  noArticlesMsg: string;
};

export default function ArticlesList({ page, noArticlesMsg }: Props) {
  const dispatch = useDispatch();

  const { data: response, error, isFetching } = articlesApi.useFetchArticlesQuery(page);
  const { success, code, data, message } = formatQueryResults(response, error);

  const [ count, setCount ] = useState(0);
  const [ articles, setArticles ] = useState<ArticleAtClient[]>([]);

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
      return (
        <Spinner />
      );
    }
  
    if (message) {
      return (
        <ErrorMessage code={code} message={message} />
      );
    }
  
    if (success && count === 0) {
      return (
        <p className={twNoNewsMessage}>
          {noArticlesMsg}
        </p>
      );
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

const twNoNewsMessage = classesBeautify(`
  mt-8 px-6
  font-roboto text-xl text-center whitespace-pre
  animate-fade-in
  text-lt-page-fg/60 dark:text-dt-page-fg/40
`);
