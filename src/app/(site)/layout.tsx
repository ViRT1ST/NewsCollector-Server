'use client';

import { Provider } from 'react-redux';
import { useEffect, useState, ReactNode } from 'react';

import { store } from '@/lib/frontend/store';

export default function ContentLayout({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

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
