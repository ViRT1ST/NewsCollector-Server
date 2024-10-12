'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useGlobalStore } from '@/stores/global';
import { getCookies } from '@/utils/cookies';

type Props = React.ComponentPropsWithoutRef<'div'>;

export default function PrivateArea({ children }: Props) {
  const router = useRouter();

  const stateToken = useGlobalStore((state) => state.userData.token);
  const updateUserData = useGlobalStore((state) => state.updateUserData);

  const { uuid: cookieUuid, email: cookieEmail, token: cookieToken } = getCookies();

  if (!stateToken && cookieUuid && cookieEmail && cookieToken) {
    updateUserData({
      uuid: cookieUuid, 
      email: cookieEmail,
      token: cookieToken
    });
  }

  useEffect(() => {
    if (!stateToken && !cookieToken) {
      router.push('/page/auth');
    }
  }, [stateToken, cookieToken]);

  if (stateToken) {
    return children;
  } else {
    return null;
  }
}

