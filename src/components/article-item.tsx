'use client';

import { FaHeart, FaTrash } from 'react-icons/fa';
import { twMerge } from 'tailwind-merge';
import { useRef } from 'react';

import { convertDateToAgo, hideElementWithCollapsing } from '@/lib/frontend/utils/articles';
import { useSaveArticleMutation, useDeleteArticleMutation } from '@/lib/frontend/store';
import { classesBeautify } from '@/lib/frontend/utils/styles';
import { ArticleAtClient } from '@/lib/types';

type Props = {
  article: ArticleAtClient;
  page: string;
  onCountDecrease: () => void;
};

export default function ArticleItem({ article, page, onCountDecrease }: Props) {
  const { uuid, site, section, title, url, created_at } = article;

  const isSavedPage = page === 'saved';

  const containerRef = useRef<HTMLDivElement>(null);

  const [saveArticle] = useSaveArticleMutation();
  const [deleteArticle] = useDeleteArticleMutation();

  const handleDeleteClick = async () => {
    await hideElementWithCollapsing(containerRef);
    onCountDecrease();
    deleteArticle(uuid);
  };

  const handleSaveClick = async () => {
    await hideElementWithCollapsing(containerRef);
    onCountDecrease();
    saveArticle(uuid);
  };

  return (
    <div ref={containerRef} className={twContainer}>
      
      <div className={twHeader}>
        <time className={twTime}>{convertDateToAgo(created_at)}</time>
        <span className={twSource}>{site} &middot; {section}</span>
        <div className={twActions}>
          <button
            className={twMerge(
              twButton,
              isSavedPage && `invisible`,
            )}
            onClick={handleSaveClick}
          >
            <span className={twButtonIcon}><FaHeart /></span>
            <span className={twButtonText}>SAVE</span>
          </button>
          <button
            className={twMerge(
              twButton, `
                hover:text-lt-btn-danger-fg hover:dark:text-dt-btn-danger-fg
                hover:bg-dt-btn-danger-bg hover:dark:bg-dt-btn-danger-bg
                hover:border-dt-btn-danger-bg hover:dark:border-dt-btn-danger-bg
              `
            )}
            onClick={handleDeleteClick}
          >
            <span className={twButtonIcon}><FaTrash /></span>
            <span className={twButtonText}>DELETE</span>
          </button>
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

const twButton = classesBeautify(`
  flex items-center
  border rounded font-roboto font-medium text-[0.8rem] leading-4
  bg-lt-btn-default-bg/10 dark:bg-dt-btn-default-bg/[0.03]
  text-lt-btn-default-fg dark:text-dt-btn-default-fg
  border-lt-btn-default-bg/30 dark:border-dt-btn-default-bg/30
  hover:text-lt-btn-safe-fg hover:dark:text-dt-btn-safe-fg
  hover:bg-lt-btn-safe-bg hover:dark:bg-dt-btn-safe-bg
  hover:border-lt-btn-safe-bg hover:dark:border-dt-btn-safe-bg
  ml-1.5 md:ml-2
  py-1 md:py-1
  px-2 md:px-3
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
