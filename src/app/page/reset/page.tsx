import { redirect } from 'next/navigation';
import pg from '@/lib/postgres/queries';

export default async function ResetPage() {
  await pg.resetTables();

  redirect('/page/auth');
  return null;
}