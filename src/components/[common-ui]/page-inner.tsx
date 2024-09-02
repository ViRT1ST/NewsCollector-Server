'use client';

import { useSelector, useDispatch } from 'react-redux';

import { restorePageThemeFromStorage } from '@/lib/frontend/utils/themes';
import { updateAccountData } from '@/lib/frontend/store';
import { getCookies } from '@/lib/frontend/utils/cookies';
import { classesBeautify } from '@/lib/frontend/utils/styles';
import Header from '@/components/[common-ui]/header';
import Footer from '@/components/[common-ui]/footer';

type Props = React.ComponentProps<'div'> & {
  privateRoute?: boolean;
};

export default function PageInner({ privateRoute = true, children }: Props) {
  const dispatch = useDispatch();

  restorePageThemeFromStorage();

  const stateToken = useSelector((state: any) => state.account.token);
  const { id, email, token } = getCookies();
    
  if (!stateToken && token) {
    dispatch(updateAccountData({ id, email, token }));
  }

  return (
    <div className={twContainer}>
      {privateRoute && <Header />}

      <div className={twLimiter}>
        {children}
      </div>

      {privateRoute && <Footer />}
    </div>
  );
}

const twContainer = classesBeautify(`
  flex flex-col w-full h-full min-h-screen pt-12
  bg-lt-page-bg dark:bg-dt-page-bg
`);

const twLimiter = classesBeautify(`
  py-6 flex-grow
  px-2 md:px-[5%]
`);
