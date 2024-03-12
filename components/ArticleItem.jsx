'use client';

import { FaHeart, FaTrash } from 'react-icons/fa';
import { useRef } from 'react';
import tw from 'tailwind-styled-components';

import {
  convertDateToAgo,
  hideElementWithCollapsing
} from '@/lib/frontend/utils/articles';

import {
  useSaveArticleMutation,
  useDeleteArticleMutation
} from '@/lib/frontend/store';

const ArticleItem = ({ article, onCountDecrease, page }) => {
  const { _id, createdAt, site, section, title, url } = article;

  const isSavedPage = page === 'saved';

  const element = useRef();

  const [saveArticle, saveResults] = useSaveArticleMutation();
  const [deleteArticle, deleteResults] = useDeleteArticleMutation();

  const handleDeleteClick = async () => {
    await hideElementWithCollapsing(element);
    onCountDecrease();
    deleteArticle(_id);
  };

  const handleSaveClick = async () => {
    await hideElementWithCollapsing(element);
    onCountDecrease();
    saveArticle(_id);
  };

  return (
    <Container ref={element}>
      
      <Header>
        <Time>{convertDateToAgo(createdAt)}</Time>
        <Source>{site} &middot; {section}</Source>
        <Actions>
          <Button onClick={handleSaveClick} $isSavedPage={isSavedPage}>
            <ButtonIcon><FaHeart /></ButtonIcon>
            <ButtonText>SAVE</ButtonText>
          </Button>
          <Button onClick={handleDeleteClick} $type="danger">
            <ButtonIcon><FaTrash /></ButtonIcon>
            <ButtonText>DELETE</ButtonText>
          </Button>
        </Actions>
      </Header>

      <Content>
        <Link href={url} target="_blank">{title}</Link>
      </Content>
      
    </Container>
  );
  
};

const Container = tw.div`
  flex w-full font-roboto overflow-hidden rounded

  flex-col 2xl:flex-row
  mb-4 2xl:mb-[1px]
`;

const Header = tw.div`
  bg-lt-article-bg-a dark:bg-dt-article-bg-a

  flex flex-row items-center py-1.5

  text-xs sm:text-sm md:text-[0.9rem]
  h-fit 2xl:h-10
  w-full 2xl:w-fit
  px-2 md:px-3.5
`;

const Time = tw.time`
  text-lt-article-fg-time dark:text-dt-article-fg-time

  pr-3

  w-fit md:w-32
`;

const Source = tw.span`
  text-lt-article-fg-source dark:text-dt-article-fg-source

  grow

  w-fit lg:w-56
`;

const Actions = tw.div`
  flex flex-row justify-end
`;

const Button = tw.button`
  bg-lt-btn-default-bg/10 dark:bg-dt-btn-default-bg/[0.03]
  text-lt-btn-default-fg dark:text-dt-btn-default-fg
  border-lt-btn-default-bg/30 dark:border-dt-btn-default-bg/30

  flex items-center
  border rounded font-roboto
  font-medium text-[0.8rem] leading-4

  hover:text-lt-btn-safe-fg hover:dark:text-dt-btn-safe-fg
  hover:bg-lt-btn-safe-bg hover:dark:bg-dt-btn-safe-bg
  hover:border-lt-btn-safe-bg hover:dark:border-dt-btn-safe-bg

  ${(p) => (p.$type === 'danger' && `
    hover:text-lt-btn-danger-fg hover:dark:text-dt-btn-danger-fg
    hover:bg-dt-btn-danger-bg hover:dark:bg-dt-btn-danger-bg
    hover:border-dt-btn-danger-bg hover:dark:border-dt-btn-danger-bg
  `)}

  ${(p) => (p.$isSavedPage && `invisible`)}
  
  ml-1.5 md:ml-2
  py-1 md:py-1
  px-2 md:px-3
`;

const ButtonIcon = tw.span`
  text-xs px-0.5 py-0.5

  block sm:hidden
`;

const ButtonText = tw.span`
  hidden sm:block
`;

const Content = tw.div`
  bg-lt-article-bg-b dark:bg-dt-article-bg-b

  flex items-center w-full text-lg truncate

  h-fit 2xl:h-10
  px-2 md:px-3.5 
  py-2 sm:py-2 2xl:py-1.5
`;

const Link = tw.a`
  text-lt-article-fg-link-normal dark:text-dt-article-fg-link-normal

  w-full

  visited:text-lt-article-fg-link-visited
  visited:dark:text-dt-article-fg-link-visited
  hover:underline

  whitespace-break-spaces 2xl:truncate
`;

export default ArticleItem;
