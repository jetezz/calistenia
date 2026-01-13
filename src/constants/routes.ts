export const ROUTES = {
  // Public routes
  ROOT: "/",
  LOGIN: "/login",
  PENDING_APPROVAL: "/pending-approval",
  REJECTED: "/rejected",

  // App routes (Authenticated)
  APP: {
    ROOT: "/app",
    BOOK: "book",
    MY_BOOKINGS: "my-bookings",
    REQUEST_CREDITS: "request-credits",
    PAYMENT_INFO: "payment-info",
    WEIGHT_STATS: "weight-stats",
  },

  // Admin routes
  ADMIN: {
    ROOT: "admin",
    SLOTS: "admin/slots",
    USERS: "admin/users",
    USER_DETAIL: "admin/users/:userId",
    BOOKINGS: "admin/bookings",
    PAYMENT_REQUESTS: "admin/payment-requests",
    PRICING: "admin/pricing",
    PAYMENT_METHODS: "admin/payment-methods",
    SETTINGS: "admin/settings",
  },
} as const;

export const APP_ROUTE = ROUTES.APP.ROOT;
