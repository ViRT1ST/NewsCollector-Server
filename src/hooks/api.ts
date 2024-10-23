import { useQuery, useMutation } from '@tanstack/react-query';

import { type AuthForm, type UpdateUserBody } from '@/types';
import { ROOT_PATH } from '@/config/public';
import { FetchError } from '@/utils/errors';
import { getCookies } from '@/utils/cookies';

const apiBaseUrl = `${ROOT_PATH}/api`;

/* =============================================================
Utility Functions
============================================================= */

function buildQueryOptions(method: string, body?: any) {
  const options: RequestInit = {
    method: method.toUpperCase(),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getCookies().token}`
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return options;
}

function createErrorPromise(error: any) {
  if (error instanceof FetchError) {
    return Promise.reject(error);
  }

  if (error instanceof Error) {
    return Promise.reject(new FetchError(400, error.message));
  }

  return Promise.reject(new FetchError(500, 'Unknown server error'));
}

async function doFetch(url: string, options: RequestInit) {
  try {
    const response = await fetch(url, options);
    const responseObject = await response.json();
    const { success, code, message } = responseObject;

    if (!success && message && code) {
      throw new FetchError(code, message);
    }

    return responseObject;

  } catch (error) {
    return createErrorPromise(error);
  }
}

/* =============================================================
Articles Hooks
============================================================= */

export function useGetArticles(page: string) {
  return useQuery({
    queryKey: ['articles', page],
    queryFn: async () => {
      const url = `${apiBaseUrl}/articles?find=${page}`;
      const options = buildQueryOptions('GET');
      return doFetch(url, options);
    }
  });
}

export function useSaveArticle() {
  return useMutation({
    mutationFn: async (uuid: string) => {
      const url = `${apiBaseUrl}/articles/${uuid}/save`;
      const options = buildQueryOptions('PATCH');
      return doFetch(url, options);
    }
  });
}

export function useHideArticle() {
  return useMutation({
    mutationFn: async (uuid: string) => {
      const url = `${apiBaseUrl}/articles/${uuid}/hide`;
      const options = buildQueryOptions('PATCH');
      return doFetch(url, options);
    }
  });
}

/* =============================================================
User Hooks
============================================================= */

export function useLoginUser() {
  return useMutation({
    mutationFn: async ({ email, password }: AuthForm) => {
      const url = `${apiBaseUrl}/users/login`;
      const options = buildQueryOptions('POST', { email, password});
      return doFetch(url, options);
    }
  });
}

export function useCreateUser() {
  return useMutation({
    mutationFn: async (body: AuthForm) => {
      const url = `${apiBaseUrl}/users`;
      const options = buildQueryOptions('POST', body);
      return doFetch(url, options);
    }
  });
}

export function useLogoutUser() {
  return useMutation({
    mutationFn: async () => {
      const url = `${apiBaseUrl}/users/logout`;
      const options = buildQueryOptions('POST');
      return doFetch(url, options);
    }
  });
}

export function useGetProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const url = `${apiBaseUrl}/users/me`;
      const options = buildQueryOptions('GET');
      return doFetch(url, options);
    },
  });
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: async (body: UpdateUserBody) => {
      const url = `${apiBaseUrl}/users/me`;
      const options = buildQueryOptions('PATCH', body);
      return doFetch(url, options);
    }
  });
}
