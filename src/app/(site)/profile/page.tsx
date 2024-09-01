'use client';

import { useState, useEffect, useRef } from 'react';
import tw from 'tailwind-styled-components';

import { useGetProfileQuery, useUpdateUserMutation } from '@/lib/frontend/store';
import { getApiResponse } from '@/lib/frontend/utils/api';
import { SourceAtClient, UserUpdateData } from '@/lib/types';
import PageInner from '@/components/PageInner';
import Spinner from '@/components/Spinner';
import ErrorMessage from '@/components/ErrorMessage';
import Checkbox from '@/components/Checkbox';

function ProfilePage() {
  const { data: response, error, isFetching, refetch } = useGetProfileQuery();
  const [updateUser, updateResults] = useUpdateUserMutation();

  const { success, code, data, message } = getApiResponse(response, error);

  const [sources, setSources] = useState<SourceAtClient[]>([]);
  const [profileIsUpdated, setProfileIsUpdated] = useState(false);
  
  const passwordRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (success) {
      setSources(data.sources);
    }
  }, [success]);

  useEffect(() => {
    if (updateResults.status === 'fulfilled') {
      refetch();
      setProfileIsUpdated(true);
    }
  }, [updateResults.status]);

  function onCheckboxClick(e: React.ChangeEvent<HTMLInputElement>) {
    const newSources = sources.map((item) => {
      if (item.uuid === e.target.name) {
        return { ...item, is_user_subscribed: e.target.checked };
      }

      return item;
    });

    setSources(newSources);
  }

  function onFormSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();

    setProfileIsUpdated(false);

    const data: Omit<UserUpdateData, 'uuid'> = {
      new_subscriptions: sources
        .filter((item) => item.is_user_subscribed)
        .map((item) => item.uuid),
    };

    const password = passwordRef?.current?.value;
    if (typeof password === 'string') {
      data['new_password'] = password.trim();
    }

    updateUser(data);
  }

  function renderContent() {
    if (isFetching) {
      return <Spinner />;
    }
  
    if (message) {
      return <ErrorMessage code={code} message={message} />;
    }

    if (success && sources.length === 0) {
      return;
    }

    return (
      <Form onSubmit={onFormSubmit}>

        <SectionTitle>Change subscriptions</SectionTitle>
        <SectionContent>
          <ul>
            {sources.map(({ uuid, site, section, is_user_subscribed }) => (
              <li key={uuid}>
                <Checkbox 
                  uuid={uuid}
                  name={uuid}
                  isChecked={is_user_subscribed}
                  onCheckboxClick={onCheckboxClick}
                >
                  {site} &middot; {section}
                </Checkbox>
              </li>
            ))}
          </ul>
        </SectionContent>

        <SectionTitle>Change password</SectionTitle>
        <SectionContent>
          <PasswordInput
            placeholder="Password (at least 8 characters)"
            type="password"
            name="password"
            ref={passwordRef}
          />
          <PasswordMessage>
            Leave it empty if you don&apos;t need to change your password.
          </PasswordMessage>
        </SectionContent>

        <FormSubmitButton type="submit">Save changes</FormSubmitButton>

        {profileIsUpdated && <UpdateMessage>Your data was updated!</UpdateMessage>}
      </Form>
    );
  };

  return (
    <PageInner>
      {renderContent()}
    </PageInner>
  );
}

const Form = tw.form`
  text-lt-page-fg dark:text-dt-page-fg/60
  
  mx-2.5 my-5 leading-loose font-roboto
`;

const SectionTitle = tw.h1`
  text-[1.3rem] font-medium
`;

const SectionContent = tw.div`
  px-8 py-4
`;

const PasswordInput = tw.input`
  text-lt-page-fg dark:text-neutral-950

  bg-neutral-200

  w-64 px-1.5 rounded border

  focus:outline-0
  focus:[box-shadow:0px_0px_0px_4px_rgba(128,128,128,0.3)]

  placeholder:text-neutral-500
`;

const PasswordMessage = tw.span`
  block mt-1
`;

const FormSubmitButton = tw.button`
  block my-4
  
  bg-lt-btn-default-bg/30 dark:bg-dt-btn-default-bg/[0.03]
  text-lt-btn-default-fg dark:text-dt-btn-default-fg
  border-lt-btn-default-bg/30 dark:border-dt-btn-default-bg/30

  px-4 py-3 border rounded font-roboto uppercase
  text-lg leading-4

  hover:text-lt-btn-safe-fg hover:dark:text-dt-btn-safe-fg
  hover:bg-lt-btn-safe-bg hover:dark:bg-dt-btn-safe-bg
  hover:border-lt-btn-safe-bg hover:dark:border-dt-btn-safe-bg
`;

const UpdateMessage = tw.span`
  block mt-1 font-medium opacity-0 animate-fade-in-out
`;

export default ProfilePage;
