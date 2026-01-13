import { Capacitor } from "@capacitor/core";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "@/components/layout/RootLayout";
import { HomePage } from "@/screens/client/Home/HomePage";
import { LandingPage } from "@/screens/LandingPage";
import { NotFoundPage } from "@/features/errors/pages/NotFoundPage";
import { LoginPage } from "@/features/auth";
import { DashboardPage } from "@/screens/admin/Dashboard/DashboardPage";
import { BookingsPage } from "@/screens/admin/Bookings/BookingsPage";
import { PaymentRequestsPage } from "@/screens/admin/PaymentRequests/PaymentRequestsPage";
import { UsersPage } from "@/screens/admin/Users/UsersPage";
import { UserDetailPage } from "@/screens/admin/Users/UserDetailPage";
import { SlotsPage } from "@/screens/admin/Slots/SlotsPage";
import { PricingPage } from "@/screens/admin/Pricing/PricingPage";
import { PaymentMethodsPage } from "@/screens/admin/PaymentMethods/PaymentMethodsPage";
import { SettingsPage } from "@/screens/admin/Settings/SettingsPage";
import { BookingPage } from "@/screens/client/Booking/BookingPage";
import { MyBookingsPage } from "@/screens/client/MyBookings/MyBookingsPage";
import { PaymentInfoPage } from "@/screens/client/PaymentInfo/PaymentInfoPage";
import { RequestCreditsPage } from "@/screens/client/RequestCredits/RequestCreditsPage";
import { PendingApprovalPage } from "@/screens/client/PendingApproval/PendingApprovalPage";
import { RejectedPage } from "@/screens/client/Rejected/RejectedPage";
import WeightStatsPage from "@/screens/client/WeightStatsPage";
import { ROUTES } from "@/constants/routes";

const LandingOrApp = () => {
  if (Capacitor.isNativePlatform()) {
    return <Navigate to={ROUTES.APP.ROOT} replace />;
  }
  return <LandingPage />;
};

export const router = createBrowserRouter([
  {
    path: ROUTES.ROOT,
    element: <LandingOrApp />,
  },
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.PENDING_APPROVAL,
    element: <PendingApprovalPage />,
  },
  {
    path: ROUTES.REJECTED,
    element: <RejectedPage />,
  },
  {
    path: ROUTES.APP.ROOT,
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: ROUTES.APP.BOOK,
        element: <BookingPage />,
      },
      {
        path: ROUTES.APP.MY_BOOKINGS,
        element: <MyBookingsPage />,
      },
      {
        path: ROUTES.APP.REQUEST_CREDITS,
        element: <RequestCreditsPage />,
      },
      {
        path: ROUTES.APP.PAYMENT_INFO,
        element: <PaymentInfoPage />,
      },
      {
        path: ROUTES.APP.WEIGHT_STATS,
        element: <WeightStatsPage />,
      },
      {
        path: ROUTES.ADMIN.ROOT,
        element: <DashboardPage />,
      },
      {
        path: ROUTES.ADMIN.SLOTS,
        element: <SlotsPage />,
      },
      {
        path: ROUTES.ADMIN.USERS,
        element: <UsersPage />,
      },
      {
        path: ROUTES.ADMIN.USER_DETAIL,
        element: <UserDetailPage />,
      },
      {
        path: ROUTES.ADMIN.BOOKINGS,
        element: <BookingsPage />,
      },
      {
        path: ROUTES.ADMIN.PAYMENT_REQUESTS,
        element: <PaymentRequestsPage />,
      },
      {
        path: ROUTES.ADMIN.PRICING,
        element: <PricingPage />,
      },
      {
        path: ROUTES.ADMIN.PAYMENT_METHODS,
        element: <PaymentMethodsPage />,
      },
      {
        path: ROUTES.ADMIN.SETTINGS,
        element: <SettingsPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
