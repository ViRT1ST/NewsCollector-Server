import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ROOT_PATH } from '@/constants/public';

const apiBaseUrl = `${ROOT_PATH}/api`;

function getHeaders(headers: Headers, getState: any) {
  const token = getState().account.token;

  headers.set('Content-Type', 'application/json');
  token && headers.set('Authorization', `Bearer ${token}`);  
  
  return headers;
}

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
      loginUser: builder.mutation<object, object>({
        query: (data) => {
          return {
            method: 'POST',
            url: '/users/login',
            body: data
          };
        }
      }),
      createUser: builder.mutation<object, object>({
        query: (data) => {
          return {
            method: 'POST',
            url: '/users',
            body: data
          };
        }
      }),
      logoutUser: builder.mutation<void, void>({
        query: () => {
          return {
            method: 'POST',
            url: '/users/logout',
          };
        }
      }),
      getProfile: builder.query<object, void>({
        query: () => {
          return {
            method: 'GET',
            url: '/users/me',
          };
        }
      }),
      updateUser: builder.mutation<object, object>({
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
      fetchArticles: builder.query<object, string>({
        query: (page) => {
          return {
            method: 'GET',
            url: `/articles?find=${page}`,
          };
        }
      }),
      saveArticle: builder.mutation<void, string>({
        query: (uuid) => {
          return {
            method: 'PATCH',
            url: `/articles/${uuid}/save`,
          };
        }
      }),
      deleteArticle: builder.mutation<void, string>({
        query: (uuid) => {
          return {
            method: 'PATCH',
            url: `/articles/${uuid}/hide`,
          };
        }
      }),
    };
  }
});

export {
  usersApi,
  articlesApi
};
