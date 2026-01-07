import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'


type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export const profileService = {
  async getAll() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async getByEmail(email: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error) throw error
    return data
  },

  async create(profile: ProfileInsert) {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: ProfileUpdate) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateCredits(id: string, credits: number) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ credits })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updatePaymentStatus(id: string, paymentStatus: string) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ payment_status: paymentStatus })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async createUser(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.rpc('admin_create_user', {
      p_email: email,
      p_password: password,
      p_full_name: fullName
    })
    
    if (error) throw error
    return data
  },

  async deleteUser(userId: string) {
    const { data, error } = await supabase.rpc('admin_delete_user', {
      p_user_id: userId
    })
    
    if (error) throw error
    return data
  }
}
