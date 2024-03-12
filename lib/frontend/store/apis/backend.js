import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiBaseUrl = 'http://localhost:3000/api';

const getHeaders = (headers, getState) => {
  const token = getState().account.token;

  headers.set('Content-Type', 'application/json');
  token && headers.set('Authorization', `Bearer ${token}`);  
  
  return headers;
};

const articlesApi = createApi({
  reducerPath: 'rtkq_articles',
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    prepareHeaders: (headers, { getState }) => {
      return getHeaders(headers, getState);
    },
  }),
  endpoints(builder) {
    return {
      // GET /articles?find=unreaded|saved
      fetchArticles: builder.query({
        query: (page) => {
          return {
            method: 'GET',
            url: `/articles?find=${page}`,
          };
        }
      }),
      saveArticle: builder.mutation({
        query: (id) => {
          return {
            method: 'PATCH',
            url: `/articles/${id}/save`,
          };
        }
      }),
      deleteArticle: builder.mutation({
        query: (id) => {
          return {
            method: 'PATCH',
            url: `/articles/${id}/hide`,
          };
        }
      }),
    };
  }
});

const usersApi = createApi({
  reducerPath: 'rtkq_users',
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    prepareHeaders: (headers, { getState }) => {
      return getHeaders(headers, getState);
    },
  }),
  endpoints(builder) {
    return {
      loginUser: builder.mutation({
        query: (credentials) => {
          return {
            method: 'POST',
            url: '/users/login',
            body: credentials
          };
        }
      }),
      createUser: builder.mutation({
        query: (credentials) => {
          return {
            method: 'POST',
            url: '/users',
            body: credentials
          };
        }
      }),
      logoutUser: builder.mutation({
        query: () => {
          return {
            method: 'POST',
            url: '/users/logout',
          };
        }
      }),
      getProfile: builder.query({
        query: () => {
          return {
            method: 'GET',
            url: '/users/me',
          };
        }
      }),
      updateUser: builder.mutation({
        query: (data) => {
          return {
            method: 'PATCH',
            url: '/users/me',
            body: data
          };
        }
      }),
    };
  }
});

const {
  useFetchArticlesQuery,
  useSaveArticleMutation,
  useDeleteArticleMutation
} = articlesApi;

const {
  useGetProfileQuery,
  useLoginUserMutation,
  useCreateUserMutation,
  useLogoutUserMutation,
  useUpdateUserMutation
} = usersApi;

export {
  articlesApi,
  usersApi,

  useFetchArticlesQuery,
  useSaveArticleMutation,
  useDeleteArticleMutation,

  useGetProfileQuery,
  useLoginUserMutation,
  useCreateUserMutation,
  useLogoutUserMutation,
  useUpdateUserMutation
};
