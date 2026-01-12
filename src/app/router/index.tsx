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

const LandingOrApp = () => {
  if (Capacitor.isNativePlatform()) {
    return <Navigate to="/app" replace />;
  }
  return <LandingPage />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingOrApp />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/pending-approval",
    element: <PendingApprovalPage />,
  },
  {
    path: "/rejected",
    element: <RejectedPage />,
  },
  {
    path: "/app",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "book",
        element: <BookingPage />,
      },
      {
        path: "my-bookings",
        element: <MyBookingsPage />,
      },
      {
        path: "request-credits",
        element: <RequestCreditsPage />,
      },
      {
        path: "payment-info",
        element: <PaymentInfoPage />,
      },
      {
        path: "weight-stats",
        element: <WeightStatsPage />,
      },
      {
        path: "admin",
        element: <DashboardPage />,
      },
      {
        path: "admin/slots",
        element: <SlotsPage />,
      },
      {
        path: "admin/users",
        element: <UsersPage />,
      },
      {
        path: "admin/users/:userId",
        element: <UserDetailPage />,
      },
      {
        path: "admin/bookings",
        element: <BookingsPage />,
      },
      {
        path: "admin/payment-requests",
        element: <PaymentRequestsPage />,
      },
      {
        path: "admin/pricing",
        element: <PricingPage />,
      },
      {
        path: "admin/payment-methods",
        element: <PaymentMethodsPage />,
      },
      {
        path: "admin/settings",
        element: <SettingsPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
