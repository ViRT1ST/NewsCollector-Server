'use client';

import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { accountActions } from '@/lib/redux/slices';
import { usersApi } from '@/lib/redux/apis';
import { setCookies } from '@/utils/cookies';
import { classesBeautify } from '@/utils/styles';

const loginPageConfig = {
  formTitle: 'Login',
  buttonText: 'Login',
  swichingLink: '/page/auth',
  swichingText: 'Register',
  apiHook: usersApi.useLoginUserMutation,
} as const;

const registerPageConfig = {
  formTitle: 'Registration',
  buttonText: 'Register',
  swichingLink: '/page/auth',
  swichingText: 'Log In',
  apiHook: usersApi.useCreateUserMutation,
} as const;


export default function AuthForm() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [ pageType, setPageType ] = useState('login');

  const currentPageConfig = pageType === 'login' ? loginPageConfig : registerPageConfig;

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [ authUser, authResults ] = currentPageConfig.apiHook();

  let errorMessage;
  if (authResults.status === 'rejected') {
    const error = authResults.error as any;
    errorMessage = error?.data?.message;
  }
  
  useEffect(() => {
    if (authResults.status === 'fulfilled') {
      const authData = authResults.data as any;
      const { token, user } = authData.data;
      const { uuid, email } = user;

      const userData = { uuid, email, token };
      dispatch(accountActions.updateData(userData));
      setCookies(userData);

      router.push('/page/articles/unreaded');
    }
  }, [authResults]);

  const switchPageType = () => {
    setPageType(pageType === 'login' ? 'register' : 'login');
  };
 
  const onFormSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isEmailInputExist = typeof emailRef?.current?.value === 'string';
    const isPasswordInputExist = typeof passwordRef?.current?.value === 'string';

    if (isEmailInputExist && isPasswordInputExist) {
      const userInputData = {
        email: emailRef.current.value,
        password: passwordRef.current.value
      };
  
      authUser(userInputData);
    }
  };

  return (
    <div className={twPageContainer}>
      <div className={twContentContainer}>

        <form className={twForm} onSubmit={onFormSubmit}>
          <h1 className={twTitle}>{currentPageConfig.formTitle}</h1>
          
          <label className={twLabel} htmlFor="email">Email</label>
          <input
            className={twInput}
            type="text"
            name="email"
            id="email"
            placeholder="Email"
            autoComplete="on"
            required
            ref={emailRef}
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
            ref={passwordRef}
          />

          <div className={twButtonsArea}>
            <button className={twButton} type="submit">
              {currentPageConfig.buttonText}
            </button>
          </div>
        </form>

        <div className={twLinksArea}>
          <Link className={twLinksAreaItem} href="" onClick={switchPageType}>
            {currentPageConfig.swichingText}
          </Link>
          {' | '}
          <Link className={twLinksAreaItem} href="">
            Restore Password
          </Link>
        </div>

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
