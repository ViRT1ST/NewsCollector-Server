import Theme from '@/components/[containers]/theme';
import ErrorMessage from '@/components/[common-ui]/error-message';

export default function Page404() {
  return (
    <Theme>
      <ErrorMessage code={404} message={'Page not found'} />
    </Theme>
  );
}