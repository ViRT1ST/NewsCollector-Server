import PageInner from '@/components/[common-ui]/page-inner';
import ErrorMessage from '@/components/[common-ui]/error-message';

// this code must be not in root not-found.tsx because it need access to redux
export default function Themed404Page() {
  return (
    <PageInner privateRoute={false}>
      <ErrorMessage code={404} message={'Page not found'} />
    </PageInner>
  );
}