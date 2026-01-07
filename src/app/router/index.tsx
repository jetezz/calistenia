import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/components/layout/RootLayout'
import { HomePage } from '@/features/home/pages/HomePage'
import { NotFoundPage } from '@/features/errors/pages/NotFoundPage'
import { LoginPage } from '@/features/auth'
import {
  AdminDashboardPage,
  EnhancedAdminSlotsPage,
  AdminUsersPage,
  AdminUserDetailPage,
  AdminBookingsPage,
  AdminPaymentRequestsPage,
  AdminPricingPage,
  AdminPaymentMethodsPage,
  AdminSettingsPage
} from '@/features/admin'
import {
  BookingPage,
  MyBookingsPage,
  RequestCreditsPage,
  PaymentInfoPage
} from '@/features/client'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'book',
        element: <BookingPage />,
      },
      {
        path: 'my-bookings',
        element: <MyBookingsPage />,
      },
      {
        path: 'request-credits',
        element: <RequestCreditsPage />,
      },
      {
        path: 'payment-info',
        element: <PaymentInfoPage />,
      },
      {
        path: 'admin',
        element: <AdminDashboardPage />,
      },
      {
        path: 'admin/slots',
        element: <EnhancedAdminSlotsPage />,
      },
      {
        path: 'admin/users',
        element: <AdminUsersPage />,
      },
      {
        path: 'admin/users/:userId',
        element: <AdminUserDetailPage />,
      },
      {
        path: 'admin/bookings',
        element: <AdminBookingsPage />,
      },
      {
        path: 'admin/payment-requests',
        element: <AdminPaymentRequestsPage />,
      },
      {
        path: 'admin/pricing',
        element: <AdminPricingPage />,
      },
      {
        path: 'admin/payment-methods',
        element: <AdminPaymentMethodsPage />,
      },
      {
        path: 'admin/settings',
        element: <AdminSettingsPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
