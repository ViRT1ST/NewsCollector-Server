import PageInner from '@/components/PageInner';
import ErrorMessage from '@/components/ErrorMessage';

const Themed404Page = () => {
  return (
    <PageInner privateRoute={false}>
      <ErrorMessage code={404} message={'Page not found'} />
    </PageInner>
  );
};

export default Themed404Page;
