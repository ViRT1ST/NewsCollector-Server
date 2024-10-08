'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { accountActions } from '@/lib/redux/slices';
import { getCookies } from '@/utils/cookies';

type Props = React.ComponentPropsWithoutRef<'div'>;

export default function PrivateArea({ children }: Props) {
  const dispatch = useDispatch();
  const router = useRouter();

  const jwt = useSelector((state: any) => state.account.token);
  const cookies = getCookies();

  const [ currentToken, setCurrentToken ] = useState<string | null>(jwt);

  if (!currentToken && cookies?.token) {
    dispatch(accountActions.updateData({
      id: cookies?.id,
      email: cookies?.email,
      token: cookies?.token
    }));

    setCurrentToken(cookies.token);
  }

  useEffect(() => {
    if (!currentToken) {
      router.push('/page/auth');
    }
  }, [currentToken]);

  return currentToken ? children : null;
}

