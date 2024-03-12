'use client';

import { useState, useEffect } from 'react';
import { LuMenu } from 'react-icons/lu';
import tw from 'tailwind-styled-components';
import Link from 'next/link';

const navConfig = [
  { href: '/articles/unreaded', label: 'Unreaded' },
  { href: '/articles/saved', label: 'Saved' },
  { href: '/profile', label: 'Profile' },
  { href: '/auth/logout', label: 'Logout' },
];

const Header = () => {
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
    const closeByEscape = (e) => {
      if (e.key === 'Escape') {
        setIsMenuShowing(false);
      }
    };

    window.addEventListener('keydown', closeByEscape);
    return () => window.removeEventListener('keydown', closeByEscape);
  }, []);

  return (
    <FixedHeader>
    
      <LogoAndButtons>
        <LogoLink href="/">News Collector</LogoLink>
        <MenuButton onClick={handleMenuButtonClick}><LuMenu /></MenuButton>
      </LogoAndButtons>
      
      <NavBar $isMenuShowing={isMenuShowing} onClick={handleNavClick}>
        <NavList>
          {navConfig.map(({ href, label }) => {
            return (
              <NavItem key={label}>
                <NavLink href={href}>{label}</NavLink>
              </NavItem>
            );
          })}
        </NavList>
      </NavBar>

    </FixedHeader>
  );
};

const FixedHeader = tw.header`
  fixed top-0 left-0 w-full z-10 
  flex justify-between items-center
  
  [box-shadow:_0_-16px_16px_16px_rgba(0,0,0,0.25)]
`;

const LogoAndButtons = tw.div`
  bg-lt-nav-bg dark:bg-dt-nav-bg

  flex flex-row justify-between items-center
  w-full h-12 px-3 flex-grow 
`;

const LogoLink = tw(Link)`
  text-lt-nav-fg/70 dark:text-dt-nav-fg/60

  block font-lato font-normal text-[1.3rem] uppercase

  hover:text-lt-nav-fg/90 hover:dark:text-dt-nav-fg/90
`;

const MenuButton = tw.button`
  text-lt-nav-fg/60 dark:text-dt-nav-fg/60
  border-lt-nav-fg/60 dark:border-dt-nav-fg/60

  text-3xl border rounded px-2 py-0.5

  hover:border-lt-nav-fg/90 hover:dark:border-dt-nav-fg/90
  hover:text-lt-nav-fg/90 hover:dark:text-dt-nav-fg/90

  focus:outline-0
  focus:[box-shadow:0px_0px_0px_4px_rgba(128,128,128,0.3)]

  block md:hidden
`;

const NavBar = tw.nav`
  bg-stone-950/95 md:bg-lt-nav-bg md:dark:bg-dt-nav-bg
  w-full md:w-fit
  hidden md:block
  
  ${(p) => (p.$isMenuShowing && `
    block

    pt-3 md:pt-0
    min-h-screen md:min-h-fit
  `)}
`;

const NavList = tw.ul`
  h-full flex  

  flex-col md:flex-row
  items-end md:items-center
`;

const NavItem = tw.li`
  border-lt-nav-fg/30 dark:border-dt-nav-fg/10

  h-full flex flex-col justify-center border-dotted

  py-2 md:py-0
  border-0 md:border-l-2
`;

const NavLink = tw(Link)`
  text-lt-nav-fg/80 dark:text-dt-nav-fg/60

  block h-full py-2.5
  font-opensans font-light uppercase tracking-wider

  hover:text-lt-nav-fg/100 hover:dark:text-dt-nav-fg/90

  px-5 lg:px-6
  text-2xl md:text-xl
  invert dark:filter-none md:filter-none
`;


export default Header;