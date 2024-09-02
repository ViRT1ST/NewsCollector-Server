'use client';

import { toggleTheme } from '@/lib/frontend/utils/themes';
import { classesBeautify } from '@/lib/frontend/utils/styles';

export default function Footer() {
  return (
    <footer className={twFooter}>
      <button className={twThemeSwitcher} onClick={toggleTheme}>
        Theme Switcher
      </button>
    </footer>
  );
}

const twFooter = classesBeautify(`
  flex flex-row items-center justify-end min-h-8 max-h-8 pr-4
  bg-lt-nav-bg/40 dark:bg-dt-nav-bg/40
`);

const twThemeSwitcher = classesBeautify(`
  font-roboto text-sm
  text-lt-nav-fg/75 dark:text-dt-nav-fg/40 
  hover:text-lt-nav-fg hover:dark:text-dt-nav-fg/70
`);
