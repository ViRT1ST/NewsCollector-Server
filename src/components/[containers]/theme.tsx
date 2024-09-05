'use client';

import { restorePageThemeFromStorage } from '@/utils/themes';
import { classesBeautify } from '@/utils/styles';

type Props = React.ComponentProps<'div'>;

export default function Theme({ children }: Props) {
  restorePageThemeFromStorage();

  return (
    <div className={twContainer}>
      {children}
    </div>
  );
}

const twContainer = classesBeautify(`
  flex flex-col w-full h-full min-h-screen pt-12
  bg-lt-page-bg dark:bg-dt-page-bg
`);


