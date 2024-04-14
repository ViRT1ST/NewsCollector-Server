import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { articlesApi, usersApi } from '@/lib/frontend/store/apis/backend';

import {
  accountSlice,
  updateAccountData,
  removeAccountData
} from '@/lib/frontend/store/slices/account-slice';

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

export const {
  useGetProfileQuery,
  useLoginUserMutation,
  useCreateUserMutation,
  useLogoutUserMutation,
  useUpdateUserMutation
} = usersApi;

export const {
  useFetchArticlesQuery,
  useSaveArticleMutation,
  useDeleteArticleMutation,
} = articlesApi;

export {
  updateAccountData,
  removeAccountData,
};
