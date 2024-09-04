'use client';

import { useSelector, useDispatch } from 'react-redux';

import { accountActions } from '@/lib/redux/slices';
import { restorePageThemeFromStorage } from '@/utils/themes';
import { getCookies } from '@/utils/cookies';
import { classesBeautify } from '@/utils/styles';
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
    dispatch(accountActions.updateData({ id, email, token }));
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
