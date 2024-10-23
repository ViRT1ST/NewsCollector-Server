'use client';

import { useState, useEffect } from 'react';

import { type SourceAtClient, type UpdateUserBody } from '@/types';
import { useGetProfile, useUpdateProfile } from '@/hooks/api';
import { FetchError } from '@/utils/errors';
import { classesBeautify } from '@/utils/styles';
import Spinner from '@/components/[common-ui]/spinner';
import ErrorMessage from '@/components/[common-ui]/error-message';
import Checkbox from '@/components/[common-ui]/checkbox';

export default function Profile() {
  const {
    data: profileData,
    isFetching: isProfileFetching,
    isSuccess: isProfileFetchSuccess,
    error: profileFetchError,
    refetch: profileRefetch
  } = useGetProfile();
  
  const {
    mutate: updateProfile,
    isSuccess: isProfileUpdateSuccess,
    error: profileUpdateError,
  } = useUpdateProfile();

  const [ sources, setSources ] = useState<SourceAtClient[]>([]);
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');

  useEffect(() => {
    if (!isProfileFetching && isProfileFetchSuccess) {
      setSources(profileData?.data?.sources || []);
    }
  }, [isProfileFetching, isProfileFetchSuccess, profileData]);

  useEffect(() => {
    if (isProfileUpdateSuccess && !profileUpdateError) {
      setSources([]);
      profileRefetch();
    }
  }, [isProfileUpdateSuccess, profileUpdateError, profileRefetch]);

  function handleCheckboxClick(e: React.ChangeEvent<HTMLInputElement>) {
    setSources((prev) => (
      prev.map((item) => {
        return item.uuid === e.target.name
          ? { ...item, is_user_subscribed: e.target.checked }
          : item;
      })
    ));
  }

  function handleFormSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();

    const updateUserData: UpdateUserBody = {
      new_subscriptions: sources
        .filter((item) => item.is_user_subscribed)
        .map((item) => item.uuid)
    };

    if (email) {
      updateUserData.new_email = email.trim();
    }

    if (password) {
      updateUserData.new_password = password.trim();
    }

    updateProfile(updateUserData);
  }

  if (isProfileFetching) {
    return <Spinner />;
  }

  if (profileFetchError) {
    const { code, message } = profileFetchError as FetchError;
    return (
      <ErrorMessage code={code} message={message} />
    );
  }

  if (isProfileFetchSuccess && sources.length !== 0) {
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
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className={twInputNotation}>
            Leave it empty if you don&apos;t need to change your password
          </span>
        </div>
  
        <button className={twSubmitButton} type="submit">
          Save changes
        </button>
  
        {isProfileUpdateSuccess && (
          <span className={twUpdateMessage}>Your settings was updated!</span>
        )}
  
        {profileUpdateError && (
          <span className={twUpdateMessage}>ERROR: {profileUpdateError.message}</span>
        )}
      </form>
    );
  }

  return null;
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
  border-lt-btn-default-bg/30 dark:border-dt-btn-default-bg/10
  hover:text-lt-btn-safe-fg hover:dark:text-dt-btn-safe-fg
  hover:bg-lt-btn-safe-bg hover:dark:bg-dt-btn-safe-bg
  hover:border-lt-btn-safe-bg hover:dark:border-dt-btn-safe-bg
`);

const twUpdateMessage = classesBeautify(`
  block mt-1 font-medium opacity-0 animate-fade-in-out
`);
