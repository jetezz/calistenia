import { create } from 'zustand'
import { appSettingsService, type CancellationPolicy, type AppSetting } from '@/services/appSettingsService'

interface AppSettingsState {
  settings: Record<string, any>
  cancellationPolicy: CancellationPolicy | null
  loading: boolean
  error: string | null
  
  fetchSettings: () => Promise<void>
  fetchCancellationPolicy: () => Promise<void>
  updateCancellationPolicy: (policy: CancellationPolicy, userId: string) => Promise<void>
  getCancellationPolicy: () => CancellationPolicy
}

export const useAppSettingsStore = create<AppSettingsState>((set, get) => ({
  settings: {},
  cancellationPolicy: null,
  loading: false,
  error: null,

  fetchSettings: async () => {
    set({ loading: true, error: null })
    try {
      const settings = await appSettingsService.getAllSettings()
      const settingsMap = settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value
        return acc
      }, {} as Record<string, any>)
      
      set({ 
        settings: settingsMap,
        cancellationPolicy: settingsMap.cancellation_policy || { unit: 'hours', value: 2 },
        loading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch settings',
        loading: false 
      })
    }
  },

  fetchCancellationPolicy: async () => {
    set({ loading: true, error: null })
    try {
      const policy = await appSettingsService.getCancellationPolicy()
      set({ 
        cancellationPolicy: policy,
        loading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch cancellation policy',
        cancellationPolicy: { unit: 'hours', value: 2 },
        loading: false 
      })
    }
  },

  updateCancellationPolicy: async (policy: CancellationPolicy, userId: string) => {
    set({ loading: true, error: null })
    try {
      await appSettingsService.updateCancellationPolicy(policy, userId)
      set({ 
        cancellationPolicy: policy,
        settings: { ...get().settings, cancellation_policy: policy },
        loading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update cancellation policy',
        loading: false 
      })
      throw error
    }
  },

  getCancellationPolicy: () => {
    const state = get()
    return state.cancellationPolicy || { unit: 'hours', value: 2 }
  }
}))
