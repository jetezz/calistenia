import { useEffect } from 'react'
import { usePricingPackageStore } from '@/stores'
import type { Database } from '@/types/database'

type PricingPackageInsert = Database['public']['Tables']['pricing_packages']['Insert']
type PricingPackageUpdate = Database['public']['Tables']['pricing_packages']['Update']

export function usePricingPackage() {
  const { 
    packages, 
    isLoading, 
    error,
    fetchPackages,
    fetchActivePackages,
    createPackage,
    updatePackage,
    deletePackage,
    toggleActive
  } = usePricingPackageStore()

  useEffect(() => {
    if (packages.length === 0 && !isLoading) {
      fetchActivePackages()
    }
  }, [])

  const handleCreate = async (pricingPackage: PricingPackageInsert) => {
    return createPackage(pricingPackage)
  }

  const handleUpdate = async (id: string, updates: PricingPackageUpdate) => {
    return updatePackage(id, updates)
  }

  const handleDelete = async (id: string) => {
    return deletePackage(id)
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    return toggleActive(id, isActive)
  }

  const refreshPackages = () => {
    return fetchPackages()
  }

  const refreshActivePackages = () => {
    return fetchActivePackages()
  }

  return {
    packages,
    isLoading,
    error,
    createPackage: handleCreate,
    updatePackage: handleUpdate,
    deletePackage: handleDelete,
    toggleActive: handleToggleActive,
    refreshPackages,
    refreshActivePackages
  }
}
