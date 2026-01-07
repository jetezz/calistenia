import { useState, useEffect, useMemo, useCallback } from 'react'
import { useProfile } from '@/hooks'
import { useToast } from '@/hooks'




export function useAdminUsers() {
  const {
    profiles: allProfiles,
    loading: isLoading,
    error,
    fetchProfiles,
    updateCredits,
    updatePaymentStatus,
  } = useProfile()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all')
  const { success, error: showError } = useToast()

  const users = useMemo(() => {
    return allProfiles.filter(profile => profile.role === 'user')
  }, [allProfiles])

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = searchQuery === '' || 
        user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesPaymentStatus = paymentStatusFilter === 'all' || 
        user.payment_status === paymentStatusFilter
      
      return matchesSearch && matchesPaymentStatus
    })
  }, [users, searchQuery, paymentStatusFilter])

  const fetchUsers = useCallback(async () => {
    try {
      await fetchProfiles()
    } catch (error) {
      console.error('Error fetching users:', error)
      showError('Error al cargar los usuarios')
    }
  }, [fetchProfiles, showError])

  const updateUserCredits = useCallback(async (userId: string, credits: number) => {
    try {
      await updateCredits(userId, credits)
      success(`Créditos actualizados a ${credits}`)
    } catch (error) {
      console.error('Error updating user credits:', error)
      showError('Error al actualizar los créditos')
      throw error
    }
  }, [updateCredits, success, showError])

  const updateUserPaymentStatus = useCallback(async (userId: string, paymentStatus: string) => {
    try {
      await updatePaymentStatus(userId, paymentStatus)
      success('Estado de pago actualizado')
    } catch (error) {
      console.error('Error updating payment status:', error)
      showError('Error al actualizar el estado de pago')
      throw error
    }
  }, [updatePaymentStatus, success, showError])

  useEffect(() => {
    fetchProfiles()
  }, [])

  return {
    users: filteredUsers,
    allUsers: users,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    paymentStatusFilter,
    setPaymentStatusFilter,
    refreshUsers: fetchUsers,
    updateUserCredits,
    updateUserPaymentStatus,
  }
}
