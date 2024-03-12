import tw from 'tailwind-styled-components';

const EmptyScreen = () => {
  return (
    <DivWithThemeBg />
  );
};

const DivWithThemeBg = tw.div`
  bg-lt-page-bg dark:bg-dt-page-bg
  
  w-full h-full min-h-screen-svh
`;

export default EmptyScreen;