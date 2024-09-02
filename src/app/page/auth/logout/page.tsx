'use client';

import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

import { useLogoutUserMutation, removeAccountData } from '@/lib/frontend/store/';
import { removeCookies } from '@/lib/frontend/utils/cookies';
import EmptyScreen from '@/components/[common-ui]/empty-screen';

export default function LogoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [logoutUser] = useLogoutUserMutation();

  useEffect(() => {
    logoutUser();

    removeCookies(['uuid', 'email', 'token']);
    dispatch(removeAccountData());

    router.push('/auth');
  }, []);
  
  return (
    <EmptyScreen />
  );
}