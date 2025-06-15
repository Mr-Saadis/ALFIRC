'use client'

import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast }  from 'sonner'
import { FiLogOut } from 'react-icons/fi'

export default function SignOutButton ({
  redirectTo = '/'          // where the user should land after sign-out
}) {
  const router = useRouter()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      toast.error('Sign-out failed: ' + error.message)
      return
    }

    toast.success('Signed out successfully')
    router.replace(redirectTo)    // go home (or login) after sign-out
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSignOut}
      className="flex items-center gap-2 text-md text-red-600"
    >
      <FiLogOut className="text-lg " />
      Sign out
         </Button>
  )
}
