import { useEffect } from 'react'
import { useAppSettingsStore } from '@/stores/appSettingsStore'
import type { CancellationPolicy } from '@/services/appSettingsService'

export function useAppSettings() {
  const {
    settings,
    cancellationPolicy,
    loading,
    error,
    fetchSettings,
    fetchCancellationPolicy,
    updateCancellationPolicy,
    getCancellationPolicy
  } = useAppSettingsStore()

  useEffect(() => {
    if (!cancellationPolicy) {
      fetchCancellationPolicy()
    }
  }, [cancellationPolicy, fetchCancellationPolicy])

  const updatePolicy = async (policy: CancellationPolicy, userId: string) => {
    await updateCancellationPolicy(policy, userId)
  }

  return {
    settings,
    cancellationPolicy: getCancellationPolicy(),
    loading,
    error,
    fetchSettings,
    fetchCancellationPolicy,
    updateCancellationPolicy: updatePolicy,
    getCancellationPolicy
  }
}
