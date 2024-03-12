'use client';

import { Provider } from 'react-redux';
import { useEffect, useState } from 'react';

import { store } from '@/lib/frontend/store';

const ContentLayout = ({ children }) => {
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
};

export default ContentLayout;
