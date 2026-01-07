import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface ConnectionStatus {
  isConnected: boolean
  isLoading: boolean
  error: string | null
}

export function useSupabaseConnection(): ConnectionStatus {
  const [status, setStatus] = useState<ConnectionStatus>({
    isConnected: false,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase
          .from('health_check')
          .select('status')
          .limit(1)
          .single()

        if (error) {
          if (error.code === '42P01') {
            setStatus({
              isConnected: true,
              isLoading: false,
              error: 'Table health_check not found. Run migration first.',
            })
            return
          }
          setStatus({ isConnected: false, isLoading: false, error: error.message })
          return
        }

        setStatus({
          isConnected: data?.status === 'ok',
          isLoading: false,
          error: null,
        })
      } catch (err) {
        setStatus({
          isConnected: false,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        })
      }
    }

    testConnection()
  }, [])

  return status
}
