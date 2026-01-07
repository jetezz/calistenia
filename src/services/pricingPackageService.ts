import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

type PricingPackageInsert = Database['public']['Tables']['pricing_packages']['Insert']
type PricingPackageUpdate = Database['public']['Tables']['pricing_packages']['Update']

export const pricingPackageService = {
  async getAll() {
    const { data, error } = await supabase
      .from('pricing_packages')
      .select('*')
      .order('display_order', { ascending: true })
    
    if (error) throw error
    return data
  },

  async getActive() {
    const { data, error } = await supabase
      .from('pricing_packages')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
    
    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('pricing_packages')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async create(pricingPackage: PricingPackageInsert) {
    const { data, error } = await supabase
      .from('pricing_packages')
      .insert(pricingPackage)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: PricingPackageUpdate) {
    const { data, error } = await supabase
      .from('pricing_packages')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('pricing_packages')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  async updateDisplayOrder(packageId: string, newOrder: number) {
    return this.update(packageId, { display_order: newOrder })
  },

  async toggleActive(id: string, isActive: boolean) {
    return this.update(id, { is_active: isActive })
  }
}
