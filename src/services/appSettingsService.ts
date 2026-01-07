import { supabase } from '@/lib/supabase'

export interface CancellationPolicy {
  unit: 'hours' | 'days'
  value: number
}

export interface AppSetting {
  id: string
  key: string
  value: any
  description: string | null
  updated_at: string
  updated_by: string | null
  created_at: string
}

export const appSettingsService = {
  async getSetting(key: string) {
    const { data, error } = await supabase
      .from('app_settings')
      .select('*')
      .eq('key', key)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data as AppSetting | null
  },

  async getAllSettings() {
    const { data, error } = await supabase
      .from('app_settings')
      .select('*')
      .order('key', { ascending: true })
    
    if (error) throw error
    return data as AppSetting[]
  },

  async updateSetting(key: string, value: any, userId: string) {
    const { data: existing } = await supabase
      .from('app_settings')
      .select('id')
      .eq('key', key)
      .single()

    if (existing) {
      const { data, error } = await supabase
        .from('app_settings')
        .update({
          value,
          updated_by: userId,
          updated_at: new Date().toISOString()
        })
        .eq('key', key)
        .select()
        .single()
      
      if (error) throw error
      return data as AppSetting
    } else {
      const { data, error } = await supabase
        .from('app_settings')
        .insert({
          key,
          value,
          updated_by: userId
        })
        .select()
        .single()
      
      if (error) throw error
      return data as AppSetting
    }
  },

  async getCancellationPolicy(): Promise<CancellationPolicy> {
    const setting = await this.getSetting('cancellation_policy')
    if (!setting) {
      return { unit: 'hours', value: 2 }
    }
    return setting.value as CancellationPolicy
  },

  async updateCancellationPolicy(policy: CancellationPolicy, userId: string) {
    return this.updateSetting('cancellation_policy', policy, userId)
  }
}
