import { create } from 'zustand'
import type { Database } from '@/types/database'

type PaymentRequest = Database['public']['Tables']['payment_requests']['Row']

interface PaymentRequestStore {
  paymentRequests: PaymentRequest[]
  currentPaymentRequest: PaymentRequest | null
  userPaymentRequests: PaymentRequest[]
  pendingPaymentRequests: PaymentRequest[]
  loading: boolean
  error: string | null

  setPaymentRequests: (requests: PaymentRequest[]) => void
  setCurrentPaymentRequest: (request: PaymentRequest | null) => void
  setUserPaymentRequests: (requests: PaymentRequest[]) => void
  setPendingPaymentRequests: (requests: PaymentRequest[]) => void
  addPaymentRequest: (request: PaymentRequest) => void
  updatePaymentRequest: (id: string, updates: Partial<PaymentRequest>) => void
  removePaymentRequest: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialState = {
  paymentRequests: [],
  currentPaymentRequest: null,
  userPaymentRequests: [],
  pendingPaymentRequests: [],
  loading: false,
  error: null,
}

export const usePaymentRequestStore = create<PaymentRequestStore>((set) => ({
  ...initialState,

  setPaymentRequests: (paymentRequests) => set({ paymentRequests }),
  
  setCurrentPaymentRequest: (currentPaymentRequest) => set({ currentPaymentRequest }),
  
  setUserPaymentRequests: (userPaymentRequests) => set({ userPaymentRequests }),
  
  setPendingPaymentRequests: (pendingPaymentRequests) => set({ pendingPaymentRequests }),
  
  addPaymentRequest: (request) => set((state) => ({
    paymentRequests: [request, ...state.paymentRequests],
    userPaymentRequests: [request, ...state.userPaymentRequests],
    pendingPaymentRequests: request.status === 'pending' 
      ? [request, ...state.pendingPaymentRequests]
      : state.pendingPaymentRequests
  })),
  
  updatePaymentRequest: (id, updates) => set((state) => {
    const updatedRequests = state.paymentRequests.map((request) =>
      request.id === id ? { ...request, ...updates } : request
    )
    
    const updatedUserRequests = state.userPaymentRequests.map((request) =>
      request.id === id ? { ...request, ...updates } : request
    )
    
    const updatedPendingRequests = state.pendingPaymentRequests.map((request) =>
      request.id === id ? { ...request, ...updates } : request
    ).filter(request => request.status === 'pending')
    
    return {
      paymentRequests: updatedRequests,
      userPaymentRequests: updatedUserRequests,
      pendingPaymentRequests: updatedPendingRequests,
      currentPaymentRequest: state.currentPaymentRequest?.id === id
        ? { ...state.currentPaymentRequest, ...updates }
        : state.currentPaymentRequest
    }
  }),
  
  removePaymentRequest: (id) => set((state) => ({
    paymentRequests: state.paymentRequests.filter((request) => request.id !== id),
    userPaymentRequests: state.userPaymentRequests.filter((request) => request.id !== id),
    pendingPaymentRequests: state.pendingPaymentRequests.filter((request) => request.id !== id),
    currentPaymentRequest: state.currentPaymentRequest?.id === id ? null : state.currentPaymentRequest
  })),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  reset: () => set(initialState),
}))
