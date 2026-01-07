import { useState, useEffect } from 'react'
import type { Database } from '@/types/database'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

type Profile = Database['public']['Tables']['profiles']['Row']

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      return
    }

    let mounted = true

    const fetchProfile = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error fetching profile:', error)
          if (mounted) setProfile(null)
        } else {
          if (mounted) setProfile(data)
        }
      } catch (error) {
        console.error('Profile fetch failed:', error)
        if (mounted) setProfile(null)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    fetchProfile()

    return () => {
      mounted = false
    }
  }, [user])

  const refreshProfile = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error refreshing profile:', error)
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Profile refresh failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    profile,
    isLoading,
    isAdmin: profile?.role === 'admin',
    refreshProfile
  }
}
