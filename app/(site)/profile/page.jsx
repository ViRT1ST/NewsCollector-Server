'use client';

import { useState, useEffect } from 'react';
import tw from 'tailwind-styled-components';

import { useGetProfileQuery, useUpdateUserMutation } from '@/lib/frontend/store';
import PageInner from '@/components/PageInner';
import Spinner from '@/components/Spinner';
import ErrorMessage from '@/components/ErrorMessage';
import Checkbox from '@/components/Checkbox';

const ProfilePage = () => {
  const [passwordInput, setPasswordInput] = useState('');
  const [sources, setSources] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);

  const { data: response, error, isFetching, refetch } = useGetProfileQuery();
  const [updateUser, updateResults] = useUpdateUserMutation();
  
  const onPasswordInput = (e) => {
    setPasswordInput(e.target.value);
  };

  useEffect(() => {
    if (response?.data) {
      setSources(response.data.sources);
    }
  }, [response?.success]);

  useEffect(() => {
    if (updateResults.status === 'fulfilled') {
      refetch();
      setIsUpdated(true);
    }
  }, [updateResults.status]);

  const onCheckboxClick = (e) => {
    const newArray = sources.map((item) => {
      const isUserSubscribed = item._id === e.target.name
        ? e.target.checked 
        : item.isUserSubscribed;

      return { ...item, isUserSubscribed };
    });

    setSources(newArray);
  };

  const onFormSubmit = (e) => {
    e.preventDefault();

    const checkedSources = sources
      .filter((item) => item.isUserSubscribed)
      .map((item) => item._id);

    const data = {
      subscriptions: checkedSources
    };

    const password = passwordInput.trim();
    
    if (password) {
      data.password = password;
    }

    updateUser(data);
  };

  const createSourcesList = (arr = []) => {
    const items = arr.map(({ _id, site, section, isUserSubscribed }) => (
      <li key={_id}>
        <Checkbox
          id={_id}
          name={_id}
          isChecked={isUserSubscribed}
          onCheckboxClick={onCheckboxClick}
        >
          {site} &middot; {section}
        </Checkbox>
      </li>
    ));

    return (
      <ul>{items}</ul>
    );
  };
  
  const renderContent = () => {
    if (isFetching || updateResults.isFetching) {
      return (
        <Spinner />
      );
    }

    if (error) {
      const { status, data: { message } } = error;
      return (
        <ErrorMessage code={status} message={message} />
      );
    }

    return (
      <Form onSubmit={onFormSubmit}>

        <SectionTitle>Change subscriptions</SectionTitle>
        <SectionContent>
          {createSourcesList(response.data.sources)}
        </SectionContent>

        <SectionTitle>Change password</SectionTitle>
        <SectionContent>
          <PasswordInput
            placeholder="Password (at least 8 characters)"
            type="password"
            name="password"
            value={passwordInput}
            onChange={onPasswordInput}
          />
          <PasswordMessage>
            Leave it empty if you don&apos;t need to change your password.
          </PasswordMessage>
        </SectionContent>

        <FormSubmitButton type="submit">Save changes</FormSubmitButton>

        {isUpdated && <UpdateMessage>Your data was updated!</UpdateMessage>}
      </Form>
    );
  };

  return (
    <PageInner>
      {renderContent()}
    </PageInner>
  );
};

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
