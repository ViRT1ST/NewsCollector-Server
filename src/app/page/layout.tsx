'use client';

import { Provider } from 'react-redux';
import { useEffect, useState } from 'react';

import { store } from '@/lib/redux/store';

type Props = {
  children: React.ReactNode;
};

export default function ContentLayout({ children }: Props) {
  const [ isMounted, setIsMounted ] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}
