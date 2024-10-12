import { Open_Sans, Lato, Roboto } from 'next/font/google';

import './globals.css';

export const metadata = {
  title: 'News Collector',
};

const open_sans = Open_Sans({
  subsets: ['latin', 'cyrillic'],
  weight: ['300'],
  display: 'swap',
  variable: '--font-open-sans',
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-lato',
});

const roboto = Roboto({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-roboto',
});

const rootLayoutClasses = [
  open_sans.variable,
  lato.variable,
  roboto.variable
];

type Props = {
  children: React.JSX.Element;
};

export default function RootLayout({ children } : Props) {
  return (
    <html lang="en" className={rootLayoutClasses.join(' ')}>
      <body>{children}</body>
    </html>
  );
}
