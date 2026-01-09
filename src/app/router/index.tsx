import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/components/layout/RootLayout";
import { HomePage } from "@/features/home/pages/HomePage";
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
import {
  BookingPage,
  MyBookingsPage,
  RequestCreditsPage,
  PaymentInfoPage,
} from "@/features/client";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
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
