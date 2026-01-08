import { useEffect } from "react";
import { useAdminDataStore } from "@/stores";

/**
 * Hook to manage admin data loading
 * Automatically loads dashboard data on mount if not already loaded
 * Provides access to all admin data and loading states
 */
export function useAdminData() {
  const {
    dashboardData,
    isDashboardLoading,
    dashboardError,
    dashboardInitialized,
    secondaryData,
    isSecondaryLoading,
    secondaryError,
    secondaryInitialized,
    loadDashboardData,
    loadSecondaryData,
    loadAllData,
    reset,
  } = useAdminDataStore();

  // Auto-load dashboard data on mount
  useEffect(() => {
    if (!dashboardInitialized && !isDashboardLoading) {
      loadAllData();
    }
  }, [dashboardInitialized, isDashboardLoading, loadAllData]);

  // Computed values
  const isLoading = isDashboardLoading || isSecondaryLoading;
  const hasError = dashboardError !== null || secondaryError !== null;
  const isFullyLoaded = dashboardInitialized && secondaryInitialized;

  return {
    // Dashboard data
    profiles: dashboardData?.profiles || [],
    bookings: dashboardData?.bookings || [],
    pendingPaymentRequests: dashboardData?.pending_payment_requests || [],
    activeTimeSlots: dashboardData?.active_time_slots || [],

    // Secondary data
    allTimeSlots: secondaryData?.all_time_slots || [],
    allPaymentRequests: secondaryData?.all_payment_requests || [],
    pricingPackages: secondaryData?.pricing_packages || [],
    paymentMethods: secondaryData?.payment_methods || [],
    appSettings: secondaryData?.app_settings || [],

    // Loading states
    isDashboardLoading,
    isSecondaryLoading,
    isLoading,
    isFullyLoaded,

    // Errors
    dashboardError,
    secondaryError,
    hasError,

    // Initialized flags
    dashboardInitialized,
    secondaryInitialized,

    // Actions
    refresh: loadAllData,
    refreshDashboard: loadDashboardData,
    refreshSecondary: loadSecondaryData,
    reset,
  };
}
