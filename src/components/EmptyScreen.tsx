import tw from 'tailwind-styled-components';

export default function EmptyScreen() {
  return (
    <DivWithThemeBg />
  );
}

const DivWithThemeBg = tw.div`
  bg-lt-page-bg dark:bg-dt-page-bg
  
  w-full h-full min-h-screen-svh
`;
