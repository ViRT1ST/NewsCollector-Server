import { redirect } from 'next/navigation';

import pg from '@/lib/postgres/queries';
import { IS_DEV_MODE  } from '@/config/public';

export default async function ResetPage() {
  // await pg.resetTables();
  
  redirect('/page/auth');
}