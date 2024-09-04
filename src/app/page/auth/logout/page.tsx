'use client';

import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

import { usersApi } from '@/lib/redux/apis';
import { accountActions } from '@/lib/redux/slices';
import { removeCookies } from '@/utils/cookies';
import EmptyScreen from '@/components/[common-ui]/empty-screen';

export default function LogoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [ logoutUser ] = usersApi.useLogoutUserMutation();

  useEffect(() => {
    logoutUser();

    removeCookies(['uuid', 'email', 'token']);
    dispatch(accountActions.removeData());

    router.push('/page/auth');
  }, []);
  
  return (
    <EmptyScreen />
  );
}