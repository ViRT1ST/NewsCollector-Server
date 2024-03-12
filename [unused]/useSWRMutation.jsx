import useSWRMutation from 'swr/mutation';
import { saveArticle } from '@/lib/frontend/requests';

const ArticleItem = ({ article, updateCount, page }) => {
  const _id = '';

  const { key, fetcher } = saveArticle(_id);
  const { data, trigger } = useSWRMutation(key, fetcher);
  console.log(data);

  const onSaveClick = () => {
    updateCount();

    trigger(_id);
  };

  return null;
};