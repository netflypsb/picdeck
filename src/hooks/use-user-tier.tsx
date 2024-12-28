import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/components/ui/use-toast'

export type UserTier = {
  tier: 'free' | 'pro' | 'premium'
  start_date: string
  end_date: string | null
  stripe_subscription_id: string | null
  stripe_status: 'active' | 'cancelled' | 'past_due' | 'incomplete' | null
}

export function useUserTier() {
  const { toast } = useToast()
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const newUserId = session?.user?.id ?? null
      console.log('Current user ID:', newUserId)
      setUserId(newUserId)
    }
    checkAuth()
  }, [])

  const { data: tierData, isLoading, error, refetch } = useQuery({
    queryKey: ['userTier', userId],
    queryFn: async () => {
      if (!userId) return null
      
      console.log('Fetching tier data for user:', userId)
      const { data, error } = await supabase
        .from('user_tiers')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error fetching tier:', error)
        throw error
      }
      
      console.log('Fetched tier data:', data)
      return data as UserTier
    },
    enabled: !!userId
  })

  const assignTier = async (tier: UserTier['tier'], duration?: number) => {
    try {
      if (!userId) throw new Error('User not authenticated')

      const { error } = await supabase.functions.invoke('manage-tier', {
        body: { action: 'assign', userId, tier, duration }
      })

      if (error) throw error

      toast({
        title: 'Success',
        description: `Successfully assigned ${tier} tier`,
      })

      refetch()
    } catch (error) {
      console.error('Error assigning tier:', error)
      toast({
        title: 'Error',
        description: 'Failed to assign tier',
        variant: 'destructive',
      })
    }
  }

  return {
    tier: tierData?.tier ?? 'free',
    tierData,
    isLoading,
    error,
    assignTier,
  }
}