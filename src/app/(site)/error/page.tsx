import PageInner from '@/components/PageInner';
import ErrorMessage from '@/components/ErrorMessage';

export default function Themed404Page() {
  return (
    <PageInner privateRoute={false}>
      <ErrorMessage code={404} message={'Page not found'} />
    </PageInner>
  );
}