import { redirect } from 'next/navigation';

export default function NotFoundPage() {
  redirect('/page/error');
}
