# Calistenia Emérita App

## Project Context

**Calistenia Emérita** is a boutique calisthenics center with a clear mission: **democratize access to an active life** through a close, family-oriented approach.

This web application is designed for **"Miguel Ángel"**, our buyer persona:
- 40-50 years old
- Values health over aesthetics
- Fears injury
- Needs external commitment (appointments) to stay consistent

### Design Philosophy

- **Mobile First**: Primary use case is on smartphones
- **Extreme Simplicity**: Large buttons, clear text, high contrast
- **Accessibility**: Designed for users who are not digital natives
- **Direct Interaction**: Avoid complexity of apps like Wodify

---

## Tech Stack Overview

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.x | UI library with latest features |
| **TypeScript** | 5.9+ | Type safety and developer experience |
| **Vite** | 7.x (rolldown) | Fast development and build |
| **Tailwind CSS** | 4.x | Utility-first styling |
| **shadcn/ui** | latest | Accessible, modular UI components |
| **Lucide React** | latest | Icon library |
| **Supabase** | 2.x | Backend as a Service (Auth, Database, RLS) |
| **React Router** | 7.x | Client-side navigation |
| **pnpm** | 9.x | Fast, efficient package manager |

### Why This Stack?

- **React 19**: Latest features including improved concurrent rendering
- **Tailwind v4**: Native CSS variables, better performance, OKLCH colors
- **shadcn/ui**: Copy-paste components, full control, Radix UI accessibility
- **Supabase**: Real-time database, built-in auth, Row Level Security
- **Vite + Rolldown**: Blazing fast builds and HMR

---

## Authentication Architecture

### Core Principles

The authentication system follows Supabase best practices with a clear separation of concerns:

1. **AuthContext**: Manages session state and authentication methods
2. **useProfile hook**: Handles profile data independently from auth state
3. **Simple loading states**: No skeletons, just clean loading indicators
4. **Proper session initialization**: Uses `getSession()` followed by `onAuthStateChange()` listener

### Implementation Details

**AuthContext (`src/features/auth/context/AuthContext.tsx`)**:
- Manages `user`, `session`, and `isLoading` states
- Provides auth methods: `signInWithEmail`, `signUpWithEmail`, `signInWithGoogle`, `signOut`
- Clean session initialization without race conditions
- No profile fetching (handled separately)

**useProfile Hook (`src/features/auth/hooks/useProfile.ts`)**:
- Fetches profile data when user is available
- Provides `profile`, `isLoading`, `isAdmin`, and `refreshProfile`
- Independent of auth state changes for better performance

**AuthGuard Component**:
- Simple loading state ("Loading..." instead of skeletons)
- Only checks authentication, no admin role checking
- Clean redirect to login when not authenticated

### Usage Patterns

```tsx
// For components that only need auth state
import { useAuth } from '@/features/auth'
const { user, isLoading, signOut } = useAuth()

// For components that need profile data
import { useProfile } from '@/features/auth'
const { profile, isAdmin, isLoading } = useProfile()

// For components that need both
import { useAuth, useProfile } from '@/features/auth'
const { signOut } = useAuth()
const { profile, isAdmin } = useProfile()
```

---

## Database Schema

### Entity Relationship

```
profiles (1) ──────── (N) bookings
    │                      │
    │                      │
    │                      │
    └── (1) ──── (N) payment_requests
                           │
time_slots (1) ──── (N) bookings
```

### SQL Schema for Supabase

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES TABLE
-- Extends Supabase auth.users with app-specific data
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    credits INTEGER NOT NULL DEFAULT 0 CHECK (credits >= 0),
    payment_status TEXT NOT NULL DEFAULT 'none' CHECK (payment_status IN ('paid', 'pending', 'unpaid', 'none')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- TIME_SLOTS TABLE
-- Available training slots created by admin
CREATE TABLE public.time_slots (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 4 CHECK (capacity > 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(day_of_week, start_time)
);

-- BOOKINGS TABLE
-- Reservations made by users for specific slots
CREATE TABLE public.bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    time_slot_id UUID REFERENCES public.time_slots(id) ON DELETE CASCADE NOT NULL,
    booking_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
    created_by UUID REFERENCES public.profiles(id), -- NULL if self-booked, admin_id if booked by admin
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, time_slot_id, booking_date)
);

-- PAYMENT_REQUESTS TABLE
-- Credit recharge requests from users
CREATE TABLE public.payment_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    credits_requested INTEGER NOT NULL CHECK (credits_requested > 0),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    processed_by UUID REFERENCES public.profiles(id),
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- INDEXES
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_date ON public.bookings(booking_date);
CREATE INDEX idx_bookings_slot ON public.bookings(time_slot_id);
CREATE INDEX idx_payment_requests_user ON public.payment_requests(user_id);
CREATE INDEX idx_payment_requests_status ON public.payment_requests(status);
CREATE INDEX idx_time_slots_day ON public.time_slots(day_of_week);

-- UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- APPLY UPDATED_AT TRIGGERS
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_time_slots_updated_at
    BEFORE UPDATE ON public.time_slots
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_requests_updated_at
    BEFORE UPDATE ON public.payment_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- AUTO-CREATE PROFILE ON USER SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Row Level Security (RLS) Policies

```sql
-- ENABLE RLS ON ALL TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id AND role = 'user'); -- Prevent role escalation

CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update all profiles"
    ON public.profiles FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- TIME_SLOTS POLICIES
CREATE POLICY "Anyone can view active time slots"
    ON public.time_slots FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admins can manage time slots"
    ON public.time_slots FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- BOOKINGS POLICIES
CREATE POLICY "Users can view own bookings"
    ON public.bookings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings"
    ON public.bookings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can cancel own bookings"
    ON public.bookings FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (status = 'cancelled');

CREATE POLICY "Admins can manage all bookings"
    ON public.bookings FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- PAYMENT_REQUESTS POLICIES
CREATE POLICY "Users can view own payment requests"
    ON public.payment_requests FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create payment requests"
    ON public.payment_requests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all payment requests"
    ON public.payment_requests FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
```

---

## Application Overview

### Current Implementation Status
- **Authentication & User Management**: Complete with role-based access
- **Admin Dashboard**: Full user, booking, and payment management  
- **Client Features**: Booking system, credit requests, payment info
- **Mobile-First Design**: Optimized for 40-50 age demographic
- **Technical Excellence**: Clean architecture with TypeScript integration

---

## Project Structure

```
src/
├── app/                    # Application configuration
│   ├── providers/          # Context providers (Auth, Theme, etc.)
│   └── router/             # Route configuration with role guards
├── components/             # Reusable components
│   ├── common/             # Shared business components
│   ├── layout/             # Layout components
│   └── ui/                 # shadcn/ui components
├── features/               # Feature modules (domain-driven)
│   ├── auth/               # Authentication & user management
│   ├── admin/              # Admin dashboard and management
│   ├── client/             # Client booking and profile
│   ├── errors/             # Error pages (404, 500)
│   └── home/               # Landing/home page
├── hooks/                  # Global custom hooks (model-level)
├── stores/                 # Zustand state management
├── services/               # Database operations (Supabase)
├── lib/                    # External library configurations
├── types/                  # TypeScript types and interfaces
└── utils/                  # Utility functions
```

---

## Clean Architecture with Zustand

### Architecture Overview

The application follows a **strict 3-layer clean architecture** with Zustand for state management:

```
┌─────────────────────┐
│    UI Layer         │  Pages & Components (Pure presentation)
│  (React Components) │  ↓ Only calls hooks, renders UI
└─────────────────────┘  
           ↓
┌─────────────────────┐
│  Business Logic     │  Custom Hooks (Orchestration & business logic)
│    (Hooks)          │  ↓ Connects UI with data layer
└─────────────────────┘  
           ↓
┌─────────────────────┐
│   Data Layer        │  Stores (Zustand) + Services (Database)
│ (Stores + Services) │  ↓ State management + DB operations
└─────────────────────┘  
           ↓
┌─────────────────────┐
│     Database        │  Supabase (PostgreSQL + RLS)
│    (Supabase)       │  
└─────────────────────┘  
```

### Layer Relationships & Responsibilities

#### **1. UI Layer (Components & Pages)**
- **Responsibility**: Pure presentation and user interaction handling
- **What they can do**: 
  - Render UI based on props and hook data
  - Handle user events (clicks, form submissions)
  - Manage local UI state (form inputs, modal states)
- **What they CANNOT do**:
  - Direct database calls
  - Business logic or data processing
  - Direct store mutations
- **How they get data**: Only through custom hooks

#### **2. Business Logic Layer (Hooks)**
- **Responsibility**: Orchestrate business logic and connect UI with data
- **Types**:
  - **Model Hooks**: Direct connection to stores (`useProfile`, `useBooking`)
  - **Feature Hooks**: Complex workflows combining multiple models
  - **Component Hooks**: Form logic and component-specific behavior
- **What they do**:
  - Call store actions and read store state
  - Implement business rules and validation
  - Handle async operations and error states
  - Transform data for UI consumption

#### **3. Data Layer (Stores + Services)**

**Stores (Zustand State Management)**
- **Responsibility**: Global application state and computed values
- **What they contain**:
  - Current data state (entities, loading, errors)
  - Computed values and derived state
  - Actions to mutate state
- **What they do**: 
  - Call services for data operations
  - Update global state based on service responses
  - Provide reactive state to hooks

**Services (Database Operations)**
- **Responsibility**: All database interactions and API calls
- **What they do**:
  - CRUD operations with Supabase
  - Data transformation and validation
  - Error handling for database operations
- **What they return**: Raw data or throw errors

### Data Flow Architecture

```
User Action → Component → Hook → Store → Service → Database
    ↓           ↓         ↓       ↓        ↓         ↓
UI Event → Event Handler → Business Logic → State Update → DB Call → Response
    ↓           ↓         ↓       ↓        ↓         ↓
   Result ← UI Update ← Hook Response ← Store State ← Service Result ← DB Data
```

### Example Flow: Creating a Booking

```typescript
// 1. User clicks "Book" button in BookingPage component
<Button onClick={handleBookSlot}>Book Slot</Button>

// 2. Component calls hook method
const { createBooking, isLoading } = useBooking()
const handleBookSlot = () => createBooking(slotId, date)

// 3. Hook calls store action
const useBooking = () => {
  const createBooking = useBookingStore(state => state.createBooking)
  // Hook orchestrates business logic
}

// 4. Store action calls service and updates state
const createBooking = async (slotId, date) => {
  set({ isLoading: true })
  const booking = await bookingService.createBooking(slotId, date)
  set({ bookings: [...bookings, booking], isLoading: false })
}

// 5. Service makes database call
const createBooking = async (slotId, date) => {
  const { data, error } = await supabase.from('bookings').insert({...})
  if (error) throw error
  return data
}
```

---

## Domain Models & Business Logic

### **Profile Model** - User Identity & Credit Management

**Objective**: Manage user identity, role-based access, and credit system for class bookings.

**Core Functionality**:
- **Identity Management**: User profiles with authentication integration
- **Role-Based Access**: Admin vs Client permissions and UI variations
- **Credit System**: Virtual currency for class reservations
- **Payment Status Tracking**: Monitor user payment states

**Business Rules**:
- Users start with 0 credits and must request more to book classes
- Admin approval required for credit requests
- Credits are deducted automatically when booking confirmed
- Role escalation prevented (users cannot promote themselves to admin)

**Store State** (`profileStore.ts`):
```typescript
{
  profiles: Profile[],           // All user profiles (admin view)
  currentProfile: Profile | null, // Currently viewed/edited profile
  loading: boolean,
  error: string | null
}
```

**Service Operations** (`profileService.ts`):
- `fetchProfileById()` - Get user by ID
- `fetchAllProfiles()` - Get all users (admin only)
- `updateProfile()` - Update user data
- `updateCredits()` - Add/subtract credits
- `updatePaymentStatus()` - Change payment state

**Hook Interface** (`useProfile.ts`):
```typescript
{
  profiles: Profile[],
  currentProfile: Profile | null,
  loading: boolean,
  fetchProfileById: (id: string) => Promise<void>,
  updateCredits: (userId: string, amount: number) => Promise<void>,
  updatePaymentStatus: (userId: string, status: PaymentStatus) => Promise<void>
}
```

### **TimeSlot Model** - Schedule Management

**Objective**: Define weekly recurring training schedules with capacity management and availability tracking.

**Core Functionality**:
- **Weekly Scheduling**: Recurring slots by day of week and time
- **Capacity Management**: Maximum participants per session
- **Availability Tracking**: Real-time booking count vs capacity
- **Admin Control**: Enable/disable slots, modify capacity

**Business Rules**:
- Each time slot has a fixed capacity (default 4 people)
- Slots are weekly recurring (Monday 18:00, Tuesday 19:00, etc.)
- Users can only book available slots (not at capacity)
- Only active slots are visible to clients
- Admin can modify all slot properties

**Store State** (`timeSlotStore.ts`):
```typescript
{
  timeSlots: TimeSlot[],
  activeTimeSlots: TimeSlot[],     // Only active slots
  slotAvailability: Record<string, {
    capacity: number,
    booked: number,
    available: number
  }>,
  loading: boolean,
  error: string | null
}
```

**Service Operations** (`timeSlotService.ts`):
- `fetchTimeSlots()` - Get all time slots
- `fetchActiveTimeSlots()` - Get only active slots
- `createTimeSlot()` - Create new recurring slot
- `updateTimeSlot()` - Modify slot properties
- `deleteTimeSlot()` - Remove slot
- `fetchAvailableSpots()` - Get availability for specific slot/date

**Hook Interface** (`useTimeSlot.ts`):
```typescript
{
  timeSlots: TimeSlot[],
  activeTimeSlots: TimeSlot[],
  availability: Record<string, SlotAvailability>,
  loading: boolean,
  createTimeSlot: (slot: CreateTimeSlotData) => Promise<void>,
  fetchAvailableSpots: (slotId: string, date: string) => Promise<number>
}
```

### **Booking Model** - Reservation Management

**Objective**: Handle class reservations with conflict prevention, credit management, and scheduling constraints.

**Core Functionality**:
- **Reservation System**: Book users into specific time slots for specific dates
- **Conflict Prevention**: Prevent double-booking same user/slot/date
- **Credit Integration**: Automatic credit deduction on confirmed bookings
- **Status Tracking**: Confirmed, cancelled, completed states
- **Admin Booking**: Admins can book on behalf of users

**Business Rules**:
- One booking per user per time slot per date
- Credits deducted only on confirmation (not on creation)
- Users can cancel own bookings (credits refunded)
- Admin can manage all bookings
- Booking requires sufficient credits
- Cannot book past dates or inactive slots

**Store State** (`bookingStore.ts`):
```typescript
{
  bookings: Booking[],
  userBookings: Booking[],         // Current user's bookings
  recentBookings: Booking[],       // Admin dashboard recent activity
  loading: boolean,
  error: string | null
}
```

**Service Operations** (`bookingService.ts`):
- `fetchBookings()` - Get all bookings (admin)
- `fetchUserBookings()` - Get bookings for specific user
- `createBooking()` - Create new reservation
- `updateBooking()` - Modify booking (status changes)
- `deleteBooking()` - Remove booking
- `checkBookingConflict()` - Validate no conflicts exist

**Hook Interface** (`useBooking.ts`):
```typescript
{
  bookings: Booking[],
  userBookings: Booking[],
  loading: boolean,
  createBooking: (slotId: string, date: string, userId?: string) => Promise<void>,
  cancelBooking: (bookingId: string) => Promise<void>,
  checkBookingConflict: (slotId: string, date: string, userId: string) => Promise<boolean>
}
```

### **PaymentRequest Model** - Credit Purchase Management

**Objective**: Handle user requests for credit purchases with admin approval workflow and payment tracking.

**Core Functionality**:
- **Credit Requests**: Users request specific amounts of class credits
- **Approval Workflow**: Admin review and approve/reject with notes
- **Payment Tracking**: Link requests to actual payments
- **Package Pricing**: Predefined credit packages with pricing

**Business Rules**:
- Users can request credits using predefined packages
- All requests require admin approval
- Approved requests automatically add credits to user account
- Rejected requests can include admin notes explaining why
- One pending request per user at a time
- Payment confirmation tracked separately from credit granting

**Store State** (`paymentRequestStore.ts`):
```typescript
{
  paymentRequests: PaymentRequest[],
  userRequests: PaymentRequest[],    // Current user's requests
  pendingRequests: PaymentRequest[], // Admin: requests needing review
  loading: boolean,
  error: string | null
}
```

**Service Operations** (`paymentRequestService.ts`):
- `fetchPaymentRequests()` - Get all requests (admin)
- `fetchUserPaymentRequests()` - Get requests for specific user
- `createPaymentRequest()` - Submit new credit request
- `updatePaymentRequest()` - Process request (approve/reject)
- `fetchPendingRequests()` - Get requests awaiting approval

**Hook Interface** (`usePaymentRequest.ts`):
```typescript
{
  paymentRequests: PaymentRequest[],
  userRequests: PaymentRequest[],
  pendingRequests: PaymentRequest[],
  loading: boolean,
  createPaymentRequest: (credits: number, notes?: string) => Promise<void>,
  updatePaymentRequest: (id: string, updates: PaymentRequestUpdate) => Promise<void>
}
```

---

## Component Integration Patterns

### Page Components (Pure UI)

```typescript
// ✅ CORRECT: Pure presentation, hooks for data
export function AdminUsersPage() {
  const { profiles, loading, updateCredits } = useProfile()
  
  if (loading) return <PageLoadingState />
  
  return (
    <div>
      {profiles.map(user => (
        <UserCard 
          key={user.id} 
          user={user} 
          onUpdateCredits={updateCredits}
        />
      ))}
    </div>
  )
}

// ❌ WRONG: Direct service calls, business logic
export function AdminUsersPage() {
  const [users, setUsers] = useState([])
  
  useEffect(() => {
    // ❌ Direct service call in component
    profileService.fetchAllProfiles().then(setUsers)
  }, [])
  
  // ❌ Business logic in component
  const handleUpdateCredits = async (userId, credits) => {
    await profileService.updateCredits(userId, credits)
    // ❌ Manual state updates
    setUsers(prev => prev.map(u => u.id === userId ? {...u, credits} : u))
  }
}
```

### Hook Composition (Business Logic)

```typescript
// Model Hook - Direct store connection
export function useProfile() {
  const {
    profiles,
    loading,
    updateCredits: updateCreditsAction
  } = useProfileStore()
  
  const updateCredits = useCallback(async (userId: string, amount: number) => {
    await updateCreditsAction(userId, amount)
  }, [updateCreditsAction])
  
  return {
    profiles,
    loading,
    updateCredits
  }
}

// Feature Hook - Multiple model orchestration  
export function useClientDashboard() {
  const { profile } = useProfile()
  const { userBookings } = useBooking()
  const { userRequests } = usePaymentRequest()
  
  // Business logic combining multiple models
  const dashboardData = useMemo(() => ({
    credits: profile?.credits || 0,
    upcomingBookings: userBookings.filter(b => 
      new Date(b.booking_date) > new Date() && b.status === 'confirmed'
    ),
    lastPaymentRequest: userRequests[0],
    hasInsufficientCredits: (profile?.credits || 0) < 1
  }), [profile, userBookings, userRequests])
  
  return dashboardData
}
```

---

## Migration Benefits Achieved

### **Code Quality**
- **Zero Business Logic in UI**: All pages are pure presentation components
- **Consistent Patterns**: Same approach for all CRUD operations across models
- **Type Safety**: Full TypeScript integration with compile-time error checking
- **Predictable Structure**: Developers know exactly where to find specific functionality

### **Performance**
- **Centralized State**: Zustand prevents unnecessary re-renders with selective subscriptions
- **Optimized Updates**: Store actions batch related updates for efficiency  
- **Computed Values**: Derived state calculated once and cached in stores
- **Minimal API Calls**: Smart caching and state management reduces database requests

### **Maintainability**
- **Single Responsibility**: Each layer has one clear purpose and responsibility
- **Easy Testing**: Each layer can be tested independently with clear interfaces
- **Scalable Architecture**: Adding new models follows the same established patterns
- **Clear Dependencies**: Unidirectional data flow makes debugging straightforward

### **Developer Experience**
- **Fast Development**: Reusable hooks accelerate feature implementation
- **Easy Onboarding**: Clear architecture helps new developers understand the codebase
- **Consistent APIs**: All models follow the same store → service → database pattern
- **Excellent TypeScript**: Full type safety catches errors at compile time

---

## Changelog

### [2024-12-30] - Clean Architecture Migration Complete
- **MAJOR**: Implemented complete 3-layer clean architecture
- **MAJOR**: Created centralized services layer for all database operations
- **MAJOR**: Implemented Zustand stores for global state management
- **MAJOR**: Refactored all pages to use centralized hooks instead of direct service calls
- **MAJOR**: Removed all deprecated `adminService` and `clientService` files
- **REMOVED**: Business logic from UI components (moved to hooks layer)
- **REMOVED**: useState for data management in pages (moved to stores)
- **REMOVED**: Direct Supabase calls outside services layer
- **NEW**: Model-level hooks (`useProfile`, `useBooking`, `useTimeSlot`, `usePaymentRequest`)
- **NEW**: Feature-level orchestration hooks for complex workflows
- **IMPROVED**: Code maintainability and testability with clear separation of concerns
- **IMPROVED**: Performance with centralized state management
- **FIXED**: Duplicate business logic across features
- **ACHIEVED**: 100% clean architecture compliance

### [2024-12-30] - Authentication Refactor
- **MAJOR**: Complete authentication system refactor following Supabase best practices
- **NEW**: Separated `AuthContext` (session management) from profile data management
- **NEW**: Created `useProfile` hook for independent profile data fetching
- **REMOVED**: Complex profile fetching from auth state changes (eliminates race conditions)
- **REMOVED**: Skeleton loading states in favor of simple loading indicators
- **REMOVED**: `refreshProfile` and `isAdmin` from AuthContext (moved to useProfile)
- **FIXED**: Page reload infinite loading issue by proper session initialization
- **FIXED**: localStorage corruption issues by letting Supabase handle session storage
- **IMPROVED**: AuthGuard component simplified (no admin role checking)
- **IMPROVED**: Clean session management without manual state clearing on signOut
 
 # #   C h a n g e l o g  
  
 # # #   F i x e s  
 -   * * A d m i n   S l o t s   P a g e * * :   F i x e d   i n f i n i t e   l o o p   c a u s e d   b y   u n s t a b l e   ` u s e T o a s t `   h o o k   r e f e r e n c e s   t r i g g e r i n g   u n n e c e s s a r y   r e - r e n d e r s   a n d   A P I   c a l l s .  
 -   * * u s e T o a s t   H o o k * * :   M e m o i z e d   r e t u r n e d   f u n c t i o n s   t o   e n s u r e   s t a b i l i t y   a n d   p r e v e n t   d e p e n d e n c y   c y c l e s   i n   c o n s u m i n g   c o m p o n e n t s .  
  
 # #   C h a n g e l o g  
  
 # # #   F i x e s  
 -   * * A d m i n   S l o t s   P a g e * * :   F i x e d   i n f i n i t e   l o o p   c a u s e d   b y   ` g e t A v a i l a b l e D a t e s I n R a n g e `   t r i g g e r i n g   g l o b a l   s t o r e   u p d a t e s ,   w h i c h   c a u s e d   ` A v a i l a b i l i t y C a l e n d a r `   t o   r e - r e n d e r   a n d   r e - f e t c h   i n   a   l o o p .   R e m o v e d   g l o b a l   l o a d i n g   s t a t e   u p d a t e s   f r o m   t h i s   s p e c i f i c   d a t a   f e t c h i n g   m e t h o d   a s   t h e   c o n s u m i n g   c o m p o n e n t   h a n d l e s   i t s   o w n   l o a d i n g   s t a t e .  
  
 # #   C h a n g e l o g  
  
 # # #   F i x e s  
 -   * * C l i e n t   B o o k i n g   P a g e * * :   F i x e d   i n f i n i t e   l o o p   c a u s e d   b y   ` w e e k D a t e s `   b e i n g   r e c r e a t e d   o n   e v e r y   r e n d e r ,   t r i g g e r i n g   t h e   a v a i l a b i l i t y   f e t c h i n g   e f f e c t   r e p e a t e d l y .   M e m o i z e d   ` w e e k D a t e s `   u s i n g   ` u s e M e m o ` .  
 -   * * T i m e   S l o t   H o o k * * :   R e m o v e d   g l o b a l   l o a d i n g   s t a t e   u p d a t e s   f r o m   ` f e t c h A v a i l a b l e S p o t s `   t o   p r e v e n t   u n n e c e s s a r y   r e - r e n d e r s   i n   c o n s u m i n g   c o m p o n e n t s ,   s i m i l a r   t o   t h e   f i x   f o r   ` g e t A v a i l a b l e D a t e s I n R a n g e ` .  
 