import ArticlesList from '@/components/articles/articles-list';
import PageStructure from '@/components/[containers]/page-structure';
import type { Slug } from '@/types';

const pageConfig = {
  unreaded: {
    noArticlesMsg: 'There is no news at the moment.\nRefresh the page to check for updates.'
  },
  saved: {
    noArticlesMsg: 'You have not saved any news.'
  },
};

export default function SavedPage({ params }: Slug) {
  const page = params.slug === 'unreaded' ? 'unreaded' : 'saved';
  const noArticlesMsg = pageConfig[page].noArticlesMsg;

  return (
    <PageStructure>
      <ArticlesList page={page} noArticlesMsg={noArticlesMsg} />
    </PageStructure>
  );
}