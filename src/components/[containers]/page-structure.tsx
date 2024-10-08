import { classesBeautify } from '@/utils/styles';
import Header from '@/components/[common-ui]/header';
import Footer from '@/components/[common-ui]/footer';
import Theme from '@/components/[containers]/theme';
import PrivateArea from '@/components/[containers]/private-area';

type Props = React.ComponentPropsWithoutRef<'div'>;

export default function PageStructure({ children }: Props) {
  return (
    <Theme>
      <PrivateArea>
        <Header />
        
        <main className={twLimiter}>
          {children}
        </main>

        {<Footer />}
      </PrivateArea>
    </Theme>
  );
}

const twLimiter = classesBeautify(`
  py-4 flex-grow
  px-2 md:px-[5%]
`);
