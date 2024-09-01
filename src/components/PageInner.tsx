'use client';

import { useSelector, useDispatch } from 'react-redux';
import tw from 'tailwind-styled-components';

import { restorePageThemeFromStorage } from '@/lib/frontend/utils/themes';
import { updateAccountData } from '@/lib/frontend/store';
import { getCookies } from '@/lib/frontend/utils/cookies';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PageInner({
  privateRoute = true,
  children
}: {
  privateRoute?: boolean;
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();

  restorePageThemeFromStorage();

  const stateToken = useSelector((state: any) => state.account.token);
  const { id, email, token } = getCookies();
    
  if (!stateToken && token) {
    dispatch(updateAccountData({ id, email, token }));
  }

  return (
    <Container>
      {privateRoute && <Header />}

      <Limiter>
        {children}
      </Limiter>

      {privateRoute && <Footer />}
    </Container>
  );
}

const Container = tw.div`
  bg-lt-page-bg dark:bg-dt-page-bg 

  flex flex-col w-full h-full min-h-screen pt-12
`;

const Limiter = tw.div`
  py-6 flex-grow
  
  px-2 md:px-[5%]
`;
