import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { articlesApi, usersApi } from './apis';
import { accountSlice } from './slices';

export const store = configureStore({
  reducer: {
    [articlesApi.reducerPath]: articlesApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [accountSlice.name]: accountSlice.reducer
  },

  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(articlesApi.middleware)
      .concat(usersApi.middleware);
  }
});

setupListeners(store.dispatch);
