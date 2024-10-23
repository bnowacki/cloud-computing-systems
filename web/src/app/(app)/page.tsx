import { redirect } from 'next/navigation'

import Header from '@/components/header'
import { BUCKET } from '@/constants'
import { createClient, getUser } from '@/utils/supabase/server'

import Files from './files'

export default async function Index() {
  const supabase = createClient()

  const { user } = await getUser()

  const { data, error } = await supabase.storage.from(BUCKET).list(user.id, {
    sortBy: { column: 'created_at', order: 'desc' },
  })
  if (error) throw error
  if (!data) throw new Error('no data')

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <Header />
      <Files data={data} />
    </div>
  )
}
