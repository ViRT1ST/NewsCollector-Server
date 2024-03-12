import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { articlesApi, usersApi } from './apis/backend';

import {
  accountSlice,
  updateAccountData,
  removeAccountData
} from './slices/account-slice';

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

export {
  useFetchArticlesQuery,
  useSaveArticleMutation,
  useDeleteArticleMutation,
  
  useGetProfileQuery,
  useLoginUserMutation,
  useCreateUserMutation,
  useLogoutUserMutation,
  useUpdateUserMutation
} from './apis/backend';

export {
  updateAccountData,
  removeAccountData,
};




