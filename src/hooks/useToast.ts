import { useCallback } from 'react'
import { toast } from 'sonner'

export const useToast = () => {
  const showSuccess = useCallback((message: string) => {
    toast.success(message)
  }, [])

  const showError = useCallback((message: string) => {
    toast.error(message)
  }, [])

  const showInfo = useCallback((message: string) => {
    toast.info(message)
  }, [])

  const showWarning = useCallback((message: string) => {
    toast.warning(message)
  }, [])

  const showLoading = useCallback((message: string) => {
    return toast.loading(message)
  }, [])

  const dismiss = useCallback((toastId?: string | number) => {
    toast.dismiss(toastId)
  }, [])

  return {
    success: showSuccess,
    error: showError,
    info: showInfo,
    warning: showWarning,
    loading: showLoading,
    dismiss,
  }
}
