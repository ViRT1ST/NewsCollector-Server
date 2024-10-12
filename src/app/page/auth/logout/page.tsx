'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { removeCookies } from '@/utils/cookies';
import { useGlobalStore } from '@/stores/global';
import { useLogoutUser } from '@/hooks/api';
import PageStructure from '@/components/[containers]/page-structure';
import Spinner from '@/components/[common-ui]/spinner';

export default function LogoutPage() {
  const router = useRouter();

  const removeUserState = useGlobalStore((state) => state.removeUserData);
  const { mutate: logoutUser, isSuccess } = useLogoutUser();

  useEffect(() => {
    logoutUser();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      removeCookies(['uuid', 'email', 'token']);
      removeUserState();
      router.push('/page/auth');
    }
  }, [isSuccess]);

  return (
    <PageStructure>
      <Spinner />
    </PageStructure>
  );
}