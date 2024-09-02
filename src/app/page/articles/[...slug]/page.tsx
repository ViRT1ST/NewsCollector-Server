import ArticlesList from '@/components/articles-list';
import PageInner from '@/components/[common-ui]/page-inner';

const pageConfig = {
  unreaded: {
    noArticlesMsg: 'There is no news at the moment.\nRefresh the page to check for updates.'
  },
  saved: {
    noArticlesMsg: 'You have not saved any news.'
  },
};

type Props = {
  params: {
    slug: string[];
  };
};

export default function SavedPage({ params }: Props) {
  const page = params.slug[0] === 'unreaded' ? 'unreaded' : 'saved';
  const noArticlesMsg = pageConfig[page].noArticlesMsg;

  return (
    <PageInner>
      <ArticlesList page={page} noArticlesMsg={noArticlesMsg} />
    </PageInner>
  );
}