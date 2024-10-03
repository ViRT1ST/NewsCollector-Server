import ArticlesList from '@/components/articles/articles-list';
import PageStructure from '@/components/[containers]/page-structure';
import type { Slug } from '@/types';

const noArticlesMsgConfig = {
  unreaded: 'There is no news at the moment.\nRefresh the page later to check for updates.',
  saved: 'You have not saved any news.'
};

export default function ArticlesPage({ params }: Slug) {
  const page = params.slug === 'unreaded'
    ? 'unreaded'
    : 'saved';

  const noArticlesMsg = page === 'unreaded'
    ? noArticlesMsgConfig.unreaded
    : noArticlesMsgConfig.saved;

  return (
    <PageStructure>
      <ArticlesList page={page} noArticlesMsg={noArticlesMsg} />
    </PageStructure>
  );
}