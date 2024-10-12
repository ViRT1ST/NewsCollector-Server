import { BiLoaderCircle } from 'react-icons/bi';
import { classesBeautify } from '@/utils/styles';

export default function Spinner() {
  return (
    <div className={twContainer}>
      <BiLoaderCircle className={twIcon} />
    </div>
  );
}

const twContainer = classesBeautify(`
  w-full h-full pt-6 flex flex-col justify-start items-center
`);

const twIcon = classesBeautify(`
  text-7xl animate-self-rotate
  text-lt-nav-fg/5 dark:text-dt-nav-fg/5
`);
