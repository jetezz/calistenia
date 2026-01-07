import { useState, useEffect, useCallback } from 'react'
import { useProfile, useBooking, usePaymentRequest, useTimeSlot } from '@/hooks'
import { useToast } from '@/hooks'

export function useAdminDashboard() {
  const { 
    profiles,
    fetchProfiles,
    loading: profilesLoading 
  } = useProfile()
  
  const { 
    bookings,
    fetchBookings,
    loading: bookingsLoading 
  } = useBooking()
  
  const { 
    pendingPaymentRequests,
    fetchPendingPaymentRequests,
    loading: paymentsLoading 
  } = usePaymentRequest()
  
  const { 
    activeTimeSlots,
    fetchActiveTimeSlots,
    loading: timeSlotsLoading 
  } = useTimeSlot()
  
  const [stats, setStats] = useState({
    todayBookings: 0,
    pendingPaymentRequests: 0,
    totalUsers: 0,
    activeTimeSlots: 0
  })
  
  const isLoading = profilesLoading || bookingsLoading || paymentsLoading || timeSlotsLoading
  const { error: showError } = useToast()

  const calculateStats = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    const todayBookings = bookings.filter(booking => 
      booking.booking_date === today && booking.status === 'confirmed'
    ).length
    
    setStats({
      todayBookings,
      pendingPaymentRequests: pendingPaymentRequests.length,
      totalUsers: profiles.filter(profile => profile.role === 'user').length,
      activeTimeSlots: activeTimeSlots.length
    })
  }, [bookings, pendingPaymentRequests, profiles, activeTimeSlots])

  const fetchDashboardData = useCallback(async () => {
    try {
      await Promise.all([
        fetchProfiles(),
        fetchBookings(),
        fetchPendingPaymentRequests(),
        fetchActiveTimeSlots()
      ])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      showError('Error al cargar datos del panel')
    }
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  useEffect(() => {
    if (!isLoading) {
      calculateStats()
    }
  }, [calculateStats, isLoading])

  return {
    stats,
    isLoading,
    refreshStats: fetchDashboardData
  }
}
