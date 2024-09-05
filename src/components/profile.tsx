'use client';

import { useState, useEffect, useRef } from 'react';

import { SourceAtClient, UpdateUser } from '@/types';
import { usersApi } from '@/lib/redux/apis';
import { formatQueryResults } from '@/utils/redux';
import { classesBeautify } from '@/utils/styles';
import Spinner from '@/components/[common-ui]/spinner';
import ErrorMessage from '@/components/[common-ui]/error-message';
import Checkbox from '@/components/[common-ui]/checkbox';

export default function Profile() {
  const { data: response, error, isFetching, refetch } = usersApi.useGetProfileQuery();
  const [ updateUser, updateResults ] = usersApi.useUpdateUserMutation();

  const { success, code, data, message } = formatQueryResults(response, error);

  const [ sources, setSources ] = useState<SourceAtClient[]>([]);
  const [ updateIsSuccessful, setUpdateIsSuccessful ] = useState(false);
  const [ updateErrorMessage, setUpdateErrorMessage ] = useState<string>('');
  
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (success) {
      setSources(data.sources);
    }
  }, [success]);

  useEffect(() => {
    if (updateResults.status === 'fulfilled') {
      refetch();
      setUpdateIsSuccessful(true);
    }

    if (updateResults.status === 'rejected') {
      const error = updateResults.error as any;
      const message = error?.data?.message;
      
      if (typeof message === 'string') {
        refetch();
        setUpdateErrorMessage(message);
      }
    } 
  }, [updateResults.status]);

  function handleCheckboxClick(e: React.ChangeEvent<HTMLInputElement>) {
    const newSources = sources.map((item) => {
      return item.uuid === e.target.name
        ? { ...item, is_user_subscribed: e.target.checked }
        : item;
    });

    setSources(newSources);
  }

  function handleFormSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();

    setUpdateIsSuccessful(false);

    const updateUserData: Omit<UpdateUser, 'uuid'> = {};

    updateUserData.new_subscriptions = sources
      .filter((item) => item.is_user_subscribed)
      .map((item) => item.uuid);
    
    const email = emailRef?.current?.value;
    if (typeof email === 'string') {
      updateUserData.new_email = email.trim();
    }

    const password = passwordRef?.current?.value;
    if (typeof password === 'string') {
      updateUserData.new_password = password.trim();
    }

    updateUser(updateUserData);
  }

  if (isFetching) {
    return <Spinner />;
  }

  if (message) {
    return <ErrorMessage code={code} message={message} />;
  }

  if (success && sources.length === 0) {
    return null;
  }

  return (
    <form className={twForm} onSubmit={handleFormSubmit}>

      <h1 className={twSectionTitle}>Change subscriptions</h1>
      <div className={twSectionContent}>
        <ul>
          {sources.map(({ uuid, site, section, is_user_subscribed }) => (
            <li key={uuid}>
              <Checkbox 
                uuid={uuid}
                name={uuid}
                isChecked={is_user_subscribed}
                onCheckboxClick={handleCheckboxClick}
              >
                {site} &middot; {section}
              </Checkbox>
            </li>
          ))}
        </ul>
      </div>

      <h1 className={twSectionTitle}>Change email</h1>
      <div className={twSectionContent}>
        <input
          className={twInputField}
          placeholder="Email (valid email)"
          type="text"
          name="email"
          ref={emailRef}
        />
        <span className={twInputNotation}>
          Leave it empty if you don&apos;t need to change your email
        </span>
      </div>

      <h1 className={twSectionTitle}>Change password</h1>
      <div className={twSectionContent}>
        <input
          className={twInputField}
          placeholder="Password (at least 8 characters)"
          type="password"
          name="password"
          ref={passwordRef}
        />
        <span className={twInputNotation}>
          Leave it empty if you don&apos;t need to change your password
        </span>
      </div>

      <button className={twSubmitButton} type="submit">
        Save changes
      </button>

      {updateIsSuccessful && (
        <span className={twUpdateMessage}>Your settings was updated!</span>
      )}

      {updateErrorMessage && (
        <span className={twUpdateMessage}>ERROR: {updateErrorMessage}</span>
      )}
    </form>
  );
}

const twForm = classesBeautify(`
  mx-2.5 my-5 leading-loose font-roboto
  text-lt-page-fg dark:text-dt-page-fg/60
`);

const twSectionTitle = classesBeautify(`
  text-[1.3rem] font-medium
`);

const twSectionContent = classesBeautify(`
  px-8 py-4
`);

const twInputField = classesBeautify(`
  w-64 px-1.5 rounded bg-neutral-200 border 
  text-lt-page-fg dark:text-neutral-950
  focus:outline-0
  focus:[box-shadow:0px_0px_0px_4px_rgba(128,128,128,0.3)]
  placeholder:text-neutral-500
`);

const twInputNotation = classesBeautify(`
  block mt-1
`);

const twSubmitButton = classesBeautify(`
  block my-4 px-4 py-3 
  text-lg font-roboto uppercase leading-4 border rounded 
  bg-lt-btn-default-bg/30 dark:bg-dt-btn-default-bg/[0.03]
  text-lt-btn-default-fg dark:text-dt-btn-default-fg
  border-lt-btn-default-bg/30 dark:border-dt-btn-default-bg/30
  hover:text-lt-btn-safe-fg hover:dark:text-dt-btn-safe-fg
  hover:bg-lt-btn-safe-bg hover:dark:bg-dt-btn-safe-bg
  hover:border-lt-btn-safe-bg hover:dark:border-dt-btn-safe-bg
`);

const twUpdateMessage = classesBeautify(`
  block mt-1 font-medium opacity-0 animate-fade-in-out
`);
