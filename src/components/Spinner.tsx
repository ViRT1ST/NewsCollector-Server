import { BiLoaderCircle } from 'react-icons/bi';
import tw from 'tailwind-styled-components';

export default function Spinner() {
  return (
    <Container>
      <Icon />
    </Container>
  );
}

const Container = tw.div`
  bg-lt-page-bg dark:bg-dt-page-bg

  flex flex-col justify-start items-center
  w-full h-full pt-6
`;

const Icon = tw(BiLoaderCircle)`
  text-lt-nav-fg/5 dark:text-dt-nav-fg/5

  text-7xl
  animate-self-rotate
`;
