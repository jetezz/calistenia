import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

type PaymentMethodInsert = Database['public']['Tables']['payment_methods']['Insert']
type PaymentMethodUpdate = Database['public']['Tables']['payment_methods']['Update']

export const paymentMethodService = {
  async getAll() {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .order('display_order', { ascending: true })
    
    if (error) throw error
    return data
  },

  async getActive() {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
    
    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async create(paymentMethod: PaymentMethodInsert) {
    const { data, error } = await supabase
      .from('payment_methods')
      .insert(paymentMethod)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: PaymentMethodUpdate) {
    const { data, error } = await supabase
      .from('payment_methods')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  async updateDisplayOrder(methodId: string, newOrder: number) {
    return this.update(methodId, { display_order: newOrder })
  },

  async toggleActive(id: string, isActive: boolean) {
    return this.update(id, { is_active: isActive })
  }
}
