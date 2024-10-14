import SignOutButton from '@/components/sign-out-button'
import { createClient } from '@/utils/supabase/server'

export default async function Index() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <h1>Welcome to Cloudrive!</h1>
      <h2>{user?.email}</h2>
      <SignOutButton />
      <p>Here are your files:</p>
    </div>
  )
}
