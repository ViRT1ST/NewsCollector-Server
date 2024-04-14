'use client';

import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import tw from 'tailwind-styled-components';
import Link from 'next/link';

import { createCookies } from '@/lib/frontend/utils/cookies';

import {
  useLoginUserMutation,
  useCreateUserMutation,
  updateAccountData
} from '@/lib/frontend/store';

const authConfig: any = {
  login: {
    formTitle: 'Login',
    buttonText: 'Login',
    swichingLink: '/auth',
    swichingText: 'Register',
    apiHook: useLoginUserMutation,
  },
  register: {
    formTitle: 'Registration',
    buttonText: 'Register',
    swichingLink: '/auth',
    swichingText: 'Log In',
    apiHook: useCreateUserMutation,
  }
};

export default function AuthPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [pageType, setPageType] = useState('login');

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [authUser, authResults] = authConfig[pageType].apiHook();

  const errorMessage = authResults.error?.data?.message;

  useEffect(() => {
    if (authResults.data?.data) {
      const { token, user } = authResults.data.data;
      const { uuid, email } = user;

      const userData = { uuid, email, token };
      dispatch(updateAccountData(userData));
      createCookies(userData);

      router.push('/articles/unreaded');
    }
  }, [authResults.data?.data?.token]);

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
    <PageContainer>
      <ContentContainer>

        <Form onSubmit={onFormSubmit}>
          <Header>{authConfig[pageType].formTitle}</Header>
          
          <Label htmlFor="email">Email</Label>
          <Input
            type="text"
            name="email"
            id="email"
            placeholder="Email"
            autoComplete="on"
            required
            ref={emailRef}
          />

          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            autoComplete="on"
            required
            ref={passwordRef}
          />

          <ButtonsArea>
            <Button type="submit">{authConfig[pageType].buttonText}</Button>
          </ButtonsArea>
        </Form>

        <LinksArea>
          <LinksAreaItem href="" onClick={switchPageType}>
            {authConfig[pageType].swichingText}
          </LinksAreaItem>
          {' | '}
          <LinksAreaItem href="">
            Restore Password
          </LinksAreaItem>
        </LinksArea>

        {errorMessage && <ErrorInfo>{errorMessage}</ErrorInfo>}

      </ContentContainer>
    </PageContainer>
  );
}

const PageContainer = tw.div`
  bg-zinc-100

  w-full h-full min-h-screen-svh pt-[10%]
  font-roboto leading-4
`;

const ContentContainer = tw.div`
  bg-zinc-100

  py-5 px-[5%]
`;

const Form = tw.form`
  bg-white
  border-teal-600
  
  min-w-64 max-w-[400px] mx-auto my-5 p-5 
  border-l-[5px] rounded-xl 
`;

const Header = tw.h1`
  text-neutral-800

  mt-1 mb-2 font-medium text-center text-3xl leading-tight
`;

const Label = tw.label`
  block mb-3
`;

const Input = tw.input`
  bg-white
  border-gray-300
  text-neutral-800

  block w-full mb-3 py-2.5 px-3
  border rounded bg-clip-padding outline-0
  font-roboto leading-4 appearance-none
  transition-all duration-100 ease-in-out

  focus:border-blue-300
  focus:[box-shadow:0px_0px_0px_4px_rgba(13,109,252,0.25)]
  focus:outline-0

  placeholder:text-gray-500
`;

const ButtonsArea = tw.div`
  flex flex-col items-end
`;

const Button = tw.button`
  text-emerald-700 
  border-emerald-700

  block w-[45%] mt-2.5 mb-0.5 py-1.5 px-3
  bg-transparent border rounded text-lg text-center
  transition-all duration-100 ease-in-out

  hover:bg-emerald-700 
  hover:text-white

  focus:bg-emerald-700 
  focus:text-white
  focus:border-emerald-700
  focus:[box-shadow:0px_0px_0px_4px_rgba(4,120,87,0.35)]
  focus:outline-0
`;

const LinksArea = tw.div`
  text-neutral-800

  mt-5 text-center leading-8
`;

const LinksAreaItem = tw(Link)`
  text-sky-600

  hover:underline
`;

const ErrorInfo = tw.p`
  text-red-500
  
  leading-8 text-center
`;
