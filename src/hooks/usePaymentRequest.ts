import { useCallback } from 'react'
import { usePaymentRequestStore } from '@/stores'
import { paymentRequestService } from '@/services'
import type { Database } from '@/types/database'


type PaymentRequestInsert = Database['public']['Tables']['payment_requests']['Insert']
type PaymentRequestUpdate = Database['public']['Tables']['payment_requests']['Update']

export const usePaymentRequest = () => {
  const {
    paymentRequests,
    currentPaymentRequest,
    userPaymentRequests,
    pendingPaymentRequests,
    loading,
    error,
    setPaymentRequests,
    setCurrentPaymentRequest,
    setUserPaymentRequests,
    setPendingPaymentRequests,
    addPaymentRequest,
    updatePaymentRequest,
    removePaymentRequest,
    setLoading,
    setError,
  } = usePaymentRequestStore()

  const fetchPaymentRequests = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await paymentRequestService.getAll()
      setPaymentRequests(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch payment requests')
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, setPaymentRequests])

  const fetchPaymentRequestById = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await paymentRequestService.getById(id)
      setCurrentPaymentRequest(data)
      return data
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch payment request')
      throw error
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, setCurrentPaymentRequest])

  const fetchUserPaymentRequests = useCallback(async (userId: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await paymentRequestService.getByUserId(userId)
      setUserPaymentRequests(data)
      return data
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch user payment requests')
      throw error
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, setUserPaymentRequests])

  const fetchPendingPaymentRequests = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await paymentRequestService.getPending()
      setPendingPaymentRequests(data)
      return data
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch pending payment requests')
      throw error
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, setPendingPaymentRequests])

  const fetchPaymentRequestsByStatus = useCallback(async (status: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await paymentRequestService.getByStatus(status)
      return data
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch payment requests by status')
      throw error
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError])

  const createPaymentRequest = useCallback(async (requestData: PaymentRequestInsert) => {
    setLoading(true)
    setError(null)
    try {
      const newRequest = await paymentRequestService.create(requestData)
      addPaymentRequest(newRequest)
      return newRequest
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create payment request')
      throw error
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, addPaymentRequest])

  const updatePaymentRequestData = useCallback(async (id: string, updates: PaymentRequestUpdate) => {
    setLoading(true)
    setError(null)
    try {
      const updatedRequest = await paymentRequestService.update(id, updates)
      updatePaymentRequest(id, updatedRequest)
      return updatedRequest
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update payment request')
      throw error
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, updatePaymentRequest])

  const approvePaymentRequest = useCallback(async (id: string, processedBy: string, adminNotes?: string) => {
    setLoading(true)
    setError(null)
    try {
      const approvedRequest = await paymentRequestService.approve(id, processedBy, adminNotes)
      updatePaymentRequest(id, approvedRequest)
      return approvedRequest
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to approve payment request')
      throw error
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, updatePaymentRequest])

  const rejectPaymentRequest = useCallback(async (id: string, processedBy: string, adminNotes?: string) => {
    setLoading(true)
    setError(null)
    try {
      const rejectedRequest = await paymentRequestService.reject(id, processedBy, adminNotes)
      updatePaymentRequest(id, rejectedRequest)
      return rejectedRequest
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to reject payment request')
      throw error
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, updatePaymentRequest])

  const deletePaymentRequest = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      await paymentRequestService.delete(id)
      removePaymentRequest(id)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete payment request')
      throw error
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, removePaymentRequest])

  return {
    // State
    paymentRequests,
    currentPaymentRequest,
    userPaymentRequests,
    pendingPaymentRequests,
    loading,
    error,

    // Actions
    fetchPaymentRequests,
    fetchPaymentRequestById,
    fetchUserPaymentRequests,
    fetchPendingPaymentRequests,
    fetchPaymentRequestsByStatus,
    createPaymentRequest,
    updatePaymentRequest: updatePaymentRequestData,
    approvePaymentRequest,
    rejectPaymentRequest,
    deletePaymentRequest,
    setCurrentPaymentRequest,
  }
}
