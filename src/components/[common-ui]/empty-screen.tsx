import { classesBeautify } from '@/lib/frontend/utils/styles';

export default function EmptyScreen() {
  return (
    <div className={classesBeautify(`
      w-full h-full min-h-screen-svh
      bg-lt-page-bg dark:bg-dt-page-bg
    `)} />
  );
}
