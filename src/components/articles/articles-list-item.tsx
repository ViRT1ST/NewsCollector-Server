'use client';

import { FaHeart, FaTrash } from 'react-icons/fa';
import { twMerge } from 'tailwind-merge';
import { useRef } from 'react';

import { ArticleAtClient } from '@/types';
import { articlesApi } from '@/lib/redux/apis';
import { classesBeautify } from '@/utils/styles';
import { convertDateToAgo, hideElementWithCollapsing } from '@/utils/articles';
import ArticlesListButton from '@/components/articles/articles-list-button';

type Props = {
  article: ArticleAtClient;
  page: string;
  onRemoveFromList: (uuid: string) => void;
};

export default function ArticleItem({ article, page, onRemoveFromList }: Props) {
  const { uuid, site, section, title, url, created_at } = article;

  const isSavedPage = page === 'saved';

  const containerRef = useRef<HTMLDivElement>(null);

  const [ saveArticle ] = articlesApi.useSaveArticleMutation();
  const [ deleteArticle ] = articlesApi.useDeleteArticleMutation();

  async function removeFromList(uuid: string) {
    await hideElementWithCollapsing(containerRef);
    onRemoveFromList(uuid);
  };

  async function handleDeleteClick() {
    await removeFromList(uuid);
    deleteArticle(uuid);
  };

  const handleSaveClick = async () => {
    await removeFromList(uuid);
    saveArticle(uuid);
  };

  return (
    <div ref={containerRef} className={twContainer}>
      
      <div className={twHeader}>
        <time className={twTime}>{convertDateToAgo(created_at)}</time>
        <span className={twSource}>{site} &middot; {section}</span>
        <div className={twActions}>
          <ArticlesListButton
            className={twMerge(isSavedPage && `invisible`)}
            onClick={handleSaveClick}
            danger={false}
          >
            <span className={twButtonIcon}><FaHeart /></span>
            <span className={twButtonText}>SAVE</span>
          </ArticlesListButton>
          <ArticlesListButton
            onClick={handleDeleteClick}
            danger={true}
          >
            <span className={twButtonIcon}><FaTrash /></span>
            <span className={twButtonText}>DELETE</span>
          </ArticlesListButton>
        </div>
      </div>

      <div className={twContent}>
        <a className={twLink} href={url} target="_blank">{title}</a>
      </div>
      
    </div>
  );
}

const twContainer = classesBeautify(`
  flex w-full
  font-roboto rounded overflow-hidden
  flex-col 2xl:flex-row
  mb-4 2xl:mb-[1px]
`);

const twHeader = classesBeautify(`
  flex flex-row items-center py-1.5
  bg-lt-article-bg-a dark:bg-dt-article-bg-a
  text-xs sm:text-sm md:text-[0.9rem]
  h-fit 2xl:h-10
  w-full 2xl:w-fit
  px-2 md:px-3.5
`);

const twTime = classesBeautify(`
  pr-3
  text-lt-article-fg-time dark:text-dt-article-fg-time
  w-fit md:w-32
`);

const twSource = classesBeautify(`
  grow
  text-lt-article-fg-source dark:text-dt-article-fg-source
  w-fit lg:w-56
`);

const twActions = classesBeautify(`
  flex flex-row justify-end
`);

const twButtonIcon = classesBeautify(`
  text-xs px-0.5 py-0.5
  block sm:hidden
`);

const twButtonText = classesBeautify(`
  hidden sm:block
`);

const twContent = classesBeautify(`
  flex items-center w-full
  text-lg truncate
  bg-lt-article-bg-b dark:bg-dt-article-bg-b
  h-fit 2xl:h-10
  px-2 md:px-3.5 
  py-2 sm:py-2 2xl:py-1.5
`);

const twLink = classesBeautify(`
  w-full
  text-lt-article-fg-link-normal dark:text-dt-article-fg-link-normal
  visited:text-lt-article-fg-link-visited
  visited:dark:text-dt-article-fg-link-visited
  hover:underline
  whitespace-break-spaces 2xl:truncate
`);
