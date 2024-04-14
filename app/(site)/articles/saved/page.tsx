import ArticlesList from '@/components/ArticlesList';
import PageInner from '@/components/PageInner';

const page = 'saved';
const noArticlesMsg = 'You have not saved any news.';

export default function SavedPage() {
  return (
    <PageInner>
      <ArticlesList page={page} noArticlesMsg={noArticlesMsg} />
    </PageInner>
  );
}
