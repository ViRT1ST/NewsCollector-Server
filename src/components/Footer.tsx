'use client';

import tw from 'tailwind-styled-components';

import { toggleTheme } from '@/lib/frontend/utils/themes';

export default function Footer() {
  return (
    <StyledFooter>
      <ThemeSwitcher onClick={toggleTheme}>
        Theme Switcher
      </ThemeSwitcher>
    </StyledFooter>
  );
}

const StyledFooter = tw.footer`
  bg-lt-nav-bg/40 dark:bg-dt-nav-bg/40

  flex flex-row items-center justify-end
  min-h-8 max-h-8 pr-4
`;

const ThemeSwitcher = tw.button`
  text-lt-nav-fg/75 dark:text-dt-nav-fg/40 

  font-roboto text-sm

  hover:text-lt-nav-fg hover:dark:text-dt-nav-fg/70
`;
