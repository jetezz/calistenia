import { useEffect } from 'react'
import { useToast, useBooking, usePaymentRequest } from '@/hooks'
import { useAuth } from '@/features/auth'




export function useClientDashboard() {
  const { user } = useAuth()
  const { error: showError } = useToast()
  
  const {
    upcomingBookings: allUpcomingBookings,
    loading: bookingsLoading,
    fetchUpcomingBookings
  } = useBooking()
  
  const {
    userPaymentRequests: allPaymentRequests,
    loading: paymentsLoading,
    fetchUserPaymentRequests
  } = usePaymentRequest()
  
  const isLoading = bookingsLoading || paymentsLoading
  const upcomingBookings = allUpcomingBookings.slice(0, 3) // Show only next 3
  const recentPaymentRequest = allPaymentRequests.length > 0 ? allPaymentRequests[0] : null

  const fetchDashboardData = async () => {
    if (!user) return
    
    try {
      await fetchUpcomingBookings(user.id)
      await fetchUserPaymentRequests(user.id)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      showError('Error al cargar los datos del panel')
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  return {
    upcomingBookings,
    recentPaymentRequest,
    isLoading,
    refreshDashboard: fetchDashboardData
  }
}
