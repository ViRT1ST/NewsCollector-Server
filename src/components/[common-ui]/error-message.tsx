'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { classesBeautify } from '@/lib/frontend/utils/styles';

const redirectPath = '/page/auth';
const initialSeconds = 9;

type Props = {
  code?: number,
  message?: string,
};

export default function ErrorMessage({ code = 400, message = 'Unknown error' }: Props) {
  const router = useRouter();

  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds < 0) {
      router.push(redirectPath);
    }
  
    const timer = setInterval(() => {
      setSeconds((current) => current - 1);
    }, 1000);
  
    return () => clearInterval(timer);
  }, [seconds]);

  return (
    <div className={twContainer}>
      <h1 className={twErrorCode}>ERROR {code}</h1>
      <p className={twErrorMessage}>{message}</p>

      <hr className={twDelimiter}/>

      <p className={twCountdown}>
        You will be redirected to login page after<br />
        {seconds} seconds...
      </p>  
    </div>
  );
}

const twContainer = classesBeautify(`
  flex flex-col items-center mt-12 px-6
  font-roboto font-medium
  text-lt-page-fg/80 dark:text-dt-page-fg/60
`);

const twErrorCode = classesBeautify(`
  text-3xl text-center
`);

const twErrorMessage = classesBeautify(`
  pt-4 text-2xl text-center
`);

const twDelimiter = classesBeautify(`
  w-64 h-px my-6
  border-lt-page-fg dark:border-dt-page-fg/40
`);

const twCountdown = classesBeautify(`
  text-base text-center whitespace-break-spaces
  text-lt-page-fg/80 dark:text-dt-page-fg/40
`);
