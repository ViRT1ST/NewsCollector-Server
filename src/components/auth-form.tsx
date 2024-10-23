'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { setCookies } from '@/utils/cookies';
import { classesBeautify } from '@/utils/styles';
import { useGlobalStore } from '@/stores/global';
import { useLoginUser, useCreateUser } from '@/hooks/api';
import Spinner from './[common-ui]/spinner';

const loginPageConfig = {
  formTitle: 'Login',
  buttonText: 'Login',
  swichingLink: '/page/auth',
  swichingText: 'Register',
  apiHook: useLoginUser,
};

const registerPageConfig = {
  formTitle: 'Registration',
  buttonText: 'Register',
  swichingLink: '/page/auth',
  swichingText: 'Log In',
  apiHook: useCreateUser,
};

export default function AuthForm() {
  const router = useRouter();

  const [ pageType, setPageType ] = useState('login');
  const [ errorMessage, setErrorMessage ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');

  const pageConfig = pageType === 'login' ? loginPageConfig : registerPageConfig;

  const { mutate: authUser, data, isSuccess, isPending, error } = pageConfig.apiHook();
  const updateUserState = useGlobalStore((state) => state.updateUserData);
  
  useEffect(() => {
    if (isSuccess) {
      const { token, user } = data.data;
      const { uuid, email } = user;

      const userData = { uuid, email, token };
      updateUserState(userData);
      setCookies(userData);

      router.push('/page/articles/unreaded');
    }
  }, [isSuccess, data, updateUserState, router]);

  useEffect(() => {
    setErrorMessage(error ? error.message : '');
  }, [error]);

  function switchPageType() {
    setPageType(pageType === 'login' ? 'register' : 'login');
  }
 
  function onFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    authUser({ email, password });
  }

  return (
    <div className={twPageContainer}>
      <div className={twContentContainer}>

        <form className={twForm} onSubmit={onFormSubmit}>
          <h1 className={twTitle}>{pageConfig.formTitle}</h1>
          
          <label className={twLabel} htmlFor="email">Email</label>
          <input
            className={twInput}
            type="text"
            name="email"
            id="email"
            placeholder="Email"
            autoComplete="on"
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className={twLabel} htmlFor="password">Password</label>
          <input
            className={twInput}
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            autoComplete="on"
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className={twButtonsArea}>
            <button className={twButton} type="submit">
              {pageConfig.buttonText}
            </button>
          </div>
        </form>

        <div className={twLinksArea}>
          <Link className={twLinksAreaItem} href="" onClick={switchPageType}>
            {pageConfig.swichingText}
          </Link>
          {' | '}
          <Link className={twLinksAreaItem} href="">
            Restore Password
          </Link>
        </div>

        {isPending && <Spinner />}

        {errorMessage && (
          <div className={twErrorContainer}>
            <span>Authentication errors</span>
            <p className={twErrorInfo}>{
              errorMessage
                .split(' | ')
                .map((item: string) => `* ${item}`)
                .join('\n')
            }</p>
          </div>
        )}

      </div>
    </div>
  );
}

const twPageContainer = classesBeautify(`
  w-full h-full min-h-screen-svh pt-[10%]
  bg-zinc-100 font-roboto leading-4
`);

const twContentContainer = classesBeautify(`
  py-5 px-[5%]
  bg-zinc-100
`);

const twForm = classesBeautify(`
  min-w-64 max-w-[400px] mx-auto my-5 p-5 
  bg-white border-teal-600 border-l-[5px] rounded-xl 
`);

const twTitle = classesBeautify(`
  mt-1 mb-2 text-neutral-800 text-3xl font-medium text-center leading-tight
`);

const twLabel = classesBeautify(`
  block mb-3
`);

const twInput = classesBeautify(`
  block w-full mb-3 py-2.5 px-3
  bg-white bg-clip-padding border border-gray-300 rounded outline-0
  text-neutral-800 font-roboto leading-4 appearance-none
  transition-all duration-100 ease-in-out
  focus:border-blue-300
  focus:[box-shadow:0px_0px_0px_4px_rgba(13,109,252,0.25)]
  focus:outline-0
  placeholder:text-gray-500
`);

const twButtonsArea = classesBeautify(`
  flex flex-col items-end
`);

const twButton = classesBeautify(`
  block w-[45%] mt-2.5 mb-0.5 py-1.5 px-3
  border-emerald-700 bg-transparent border rounded
  text-emerald-700 text-lg text-center
  transition-all duration-100 ease-in-out
  hover:bg-emerald-700
  hover:text-white
  focus:bg-emerald-700 
  focus:text-white
  focus:border-emerald-700
  focus:[box-shadow:0px_0px_0px_4px_rgba(4,120,87,0.35)]
  focus:outline-0
`);

const twLinksArea = classesBeautify(`
  mt-5 text-neutral-800 text-center leading-8
`);

const twLinksAreaItem = classesBeautify(`
  text-sky-600
  hover:underline
`);

const twErrorContainer =classesBeautify(`
  min-w-64 max-w-[400px] mx-auto my-5 py-6 px-4 flex flex-col gap-3
  text-red-500 bg-red-50 border-red-200 border rounded-xl
`);

const twErrorInfo = classesBeautify(`
  text-black leading-6 whitespace-pre 
`);
