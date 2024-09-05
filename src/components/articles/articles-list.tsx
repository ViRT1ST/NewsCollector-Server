'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { articlesApi } from '@/lib/redux/apis';
import { formatQueryResults } from '@/utils/redux';
import { classesBeautify } from '@/utils/styles';
import { ArticleAtClient } from '@/types';
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

  const { data: response, error, isFetching } = articlesApi.useFetchArticlesQuery(page);
  const { success, code, data, message } = formatQueryResults(response, error);

  const [ articles, setArticles ] = useState<ArticleAtClient[]>([]);

  useEffect(() => {
    if (success) {
      setArticles(data);

      return () => {
        dispatch(articlesApi.util.resetApiState());
      };
    }

  }, [success]);

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
              {articles.length} ARTICLES IN CURRENT LIST
            </span>
            <ArticlesListButton white={true}>REFRESH</ArticlesListButton>
          </div>

          <div className={twListHeaderItem}>
            <span className={twListHeaderItemText}>
              SORT BY SITE
            </span>
            <ArticlesListButton white={true}>ASC</ArticlesListButton>
            <ArticlesListButton white={true}>DESC</ArticlesListButton>
          </div>

          <div className={twListHeaderItem}>
            <span className={twListHeaderItemText}>
              SORT BY DATE
            </span>
            <ArticlesListButton white={true}>ASC</ArticlesListButton>
            <ArticlesListButton white={true}>DESC</ArticlesListButton>
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

//bg-dt-article-bg-a
//px-2 md:px-3.5
//mb-4 2xl:mb-[1px]
const twListHeaderContainer = classesBeautify(`
  flex justify-between py-1.5 w-full
  text-white/70  border rounded border-transparent
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
  text-white/50 font-roboto text-[0.8rem] font-medium 
`);

const twNoNewsMessage = classesBeautify(`
  mt-8 px-6
  font-roboto text-xl text-center whitespace-pre
  animate-fade-in
  text-lt-page-fg/60 dark:text-dt-page-fg/40
`);
