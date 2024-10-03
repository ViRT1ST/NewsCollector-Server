import ArticlesListButton from '@/components/articles/articles-list-button';
import { classesBeautify } from '@/utils/styles';

type Props = {
  quantity: number,
  refetch: () => void,
  sort: (sorting: string) => void
}

export default function ArticlesControls({ quantity, refetch, sort }: Props) {
  return (
    <div className={twListHeaderContainer}>

      <div className={twListHeaderItem}>
        <span className={twListHeaderItemText}>
          {quantity} LINKS IN CURRENT LIST
        </span>
        <ArticlesListButton onClick={refetch} white={true}>
          REFRESH
        </ArticlesListButton>
      </div>

      <div className={twListHeaderItem}>
        <span className={twListHeaderItemText}>
          SORT BY SITE
        </span>
        <ArticlesListButton onClick={() => sort('site-asc')} white={true}>
          ASC
        </ArticlesListButton>
        <ArticlesListButton onClick={() => sort('site-desc')} white={true}>
          DESC
        </ArticlesListButton>
      </div>

      <div className={twListHeaderItem}>
        <span className={twListHeaderItemText}>
          SORT BY DATE
        </span>
        <ArticlesListButton onClick={() => sort('date-asc')} white={true}>
          ASC
        </ArticlesListButton>
        <ArticlesListButton onClick={() => sort('date-desc')} white={true}>
          DESC
        </ArticlesListButton>
      </div>

    </div>
  );
}

const twListHeaderContainer = classesBeautify(`
  flex justify-between py-1.5 w-full
  border rounded border-transparent
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
  font-roboto text-[0.8rem] font-medium
  text-lt-btn-default-fg dark:text-white/50
`);