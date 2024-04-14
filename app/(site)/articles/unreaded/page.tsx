import ArticlesList from '@/components/ArticlesList';
import PageInner from '@/components/PageInner';

const page = 'unreaded';
const noArticlesMsg = 'There is no news at the moment.\nRefresh the page to check for updates.';

export default function UnreadedPage() {
  return (
    <PageInner>
      <ArticlesList page={page} noArticlesMsg={noArticlesMsg} />
    </PageInner>
  );
}
