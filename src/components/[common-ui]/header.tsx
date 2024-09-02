'use client';

import { useState, useEffect } from 'react';
import { LuMenu } from 'react-icons/lu';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';

import { classesBeautify } from '@/lib/frontend/utils/styles';

const navConfig = [
  { href: '/page/articles/unreaded', label: 'Unreaded' },
  { href: '/page/articles/saved', label: 'Saved' },
  { href: '/page/profile', label: 'Profile' },
  { href: '/page/auth/logout', label: 'Logout' },
];

export default function Header() {
  const [isMenuShowing, setIsMenuShowing] = useState(false);

  const handleMenuButtonClick = () => {
    setIsMenuShowing((current) => !current);
  };

  const handleNavClick = () => {
    if (isMenuShowing) {
      setIsMenuShowing(false);
    }
  };

  useEffect(() => {
    const closeByEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuShowing(false);
      }
    };

    window.addEventListener('keydown', closeByEscape);
    return () => window.removeEventListener('keydown', closeByEscape);
  }, []);

  return (
    <header className={twFixedHeader}>
    
      <div className={twLogoAndButtons}>
        <Link className={twLogoLink} href="/">
          News Collector
        </Link>
        <button className={twMenuButton} onClick={handleMenuButtonClick}>
          <LuMenu />
        </button>
      </div>
      
      <nav
        className={twMerge(
          twNavBar,
          isMenuShowing && `
            block
            pt-3 md:pt-0
            min-h-screen md:min-h-fit
          `
        )}
        onClick={handleNavClick}
      >
        <ul className={twNavList}>
          {navConfig.map(({ href, label }) => {
            return (
              <li key={label} className={twNavItem}>
                <Link href={href} className={twNavLink}>
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

    </header>
  );
}

const twFixedHeader = classesBeautify(`
  z-10 w-full fixed top-0 left-0 flex justify-between items-center
  [box-shadow:_0_-16px_16px_16px_rgba(0,0,0,0.25)]
  flex-col md:flex-row
`);

const twLogoAndButtons = classesBeautify(`
  w-full h-12 px-3 flex flex-row flex-grow justify-between items-center
  bg-lt-nav-bg dark:bg-dt-nav-bg
`);

const twLogoLink = classesBeautify(`
  block font-lato font-normal text-[1.3rem] uppercase
  text-lt-nav-fg/70 dark:text-dt-nav-fg/60
  hover:text-lt-nav-fg/90 hover:dark:text-dt-nav-fg/90
`);

const twMenuButton = classesBeautify(`
  text-3xl border rounded px-2 py-0.5
  text-lt-nav-fg/50 dark:text-dt-nav-fg/40
  border-lt-nav-fg/20 dark:border-dt-nav-fg/10
  block md:hidden
  hover:border-lt-nav-fg/90 hover:dark:border-dt-nav-fg/90
  hover:text-lt-nav-fg/90 hover:dark:text-dt-nav-fg/90
  focus:outline-0
  focus:[box-shadow:0px_0px_0px_4px_rgba(128,128,128,0.3)]
`);

const twNavBar = classesBeautify(`
  bg-stone-950/95 md:bg-lt-nav-bg md:dark:bg-dt-nav-bg
  w-full md:w-fit
  hidden md:block
`);

const twNavList = classesBeautify(`
  h-full flex
  flex-col md:flex-row
  items-end md:items-center
`);

const twNavItem = classesBeautify(`
  h-full flex flex-col justify-center border-dotted
  py-2 md:py-0
  border-lt-nav-fg/30 dark:border-dt-nav-fg/10
  border-0 md:border-l-2
`);

const twNavLink = classesBeautify(`
  block h-full py-2.5
  font-opensans font-light uppercase tracking-wider
  px-5 lg:px-6
  invert dark:filter-none md:filter-none
  text-lt-nav-fg/80 dark:text-dt-nav-fg/60
  text-2xl md:text-xl
  hover:text-lt-nav-fg/100 hover:dark:text-dt-nav-fg/90
`);
