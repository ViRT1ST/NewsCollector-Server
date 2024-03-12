import { redirect } from 'next/navigation';

const NotFoundPage = () => {
  redirect('/error');
};

export default NotFoundPage;
