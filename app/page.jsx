import { redirect } from 'next/navigation';

const MainPage = () => {
  redirect('/articles/unreaded');
};

export default MainPage;
