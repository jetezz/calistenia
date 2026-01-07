# Cancellation Policy Feature

## Overview
Feature that allows administrators to configure the minimum time required before a booking can be canceled. This prevents last-minute cancellations and gives clients flexibility within configured boundaries.

## Database Changes

### New Table: `app_settings`
Stores application-wide configuration including cancellation policies.

**Fields:**
- `id`: UUID primary key
- `key`: String - Setting identifier (unique)
- `value`: JSONB - Setting value (flexible format)
- `description`: Text - Setting description
- `updated_at`: Timestamp
- `updated_by`: UUID - Reference to admin who updated

### Initial Settings
- `cancellation_policy`: Configuration for minimum cancellation window
  - `unit`: "hours" | "days"
  - `value`: Number (e.g., 2 for 2 hours, 1 for 1 day)

## Service Layer

### New: `appSettingsService`
Handles CRUD operations for application settings.

**Methods:**
- `getSetting(key)`: Retrieve specific setting
- `updateSetting(key, value, userId)`: Update setting value
- `getAllSettings()`: Get all settings

## Store Layer

### New: `appSettingsStore`
Manages application settings state in the client.

**State:**
- `settings`: Object with all app settings
- `loading`: Boolean
- `error`: String | null

**Actions:**
- `fetchSettings()`: Load all settings
- `updateSetting(key, value)`: Update specific setting
- `getCancellationPolicy()`: Get current cancellation policy

## Admin UX

### New Page: `AdminSettingsPage`
Location: `/admin/settings`

**Features:**
- Configure cancellation policy
- Choose between hours/days
- Set minimum value
- Save and apply changes
- Preview impact on clients

**Quick Access:**
- Added to Admin Dashboard as "Configuración" card
- Icon: Settings
- Description: "Políticas de cancelación"

## Client UX

### Modified: `MyBookingsPage`
**Changes:**
- Dynamic cancellation validation based on admin settings
- Updated UI text showing actual policy (not hardcoded 2 hours)
- Disable cancel button when outside policy window
- Clear feedback message explaining why cancellation is blocked

### Modified: `useUserBookings` hook
**Changes:**
- `canCancelBooking()`: Now checks against dynamic policy from store
- Fetches cancellation policy on mount
- Real-time validation

## Technical Implementation

### Validation Logic
```typescript
const canCancelBooking = (booking: Booking) => {
  const policy = getCancellationPolicy()
  const bookingDateTime = new Date(`${booking.booking_date}T${booking.time_slot.start_time}`)
  const now = new Date()
  
  let minAdvanceTime: number
  if (policy.unit === 'hours') {
    minAdvanceTime = policy.value
  } else {
    minAdvanceTime = policy.value * 24
  }
  
  const hoursDiff = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)
  return booking.status === 'confirmed' && hoursDiff > minAdvanceTime
}
```

## Migration File
`20250108000000_app_settings_cancellation_policy.sql`

Creates app_settings table and inserts default cancellation policy (2 hours).

## Files Modified/Created

### Created
- `supabase/migrations/20250108000000_app_settings_cancellation_policy.sql`
- `src/services/appSettingsService.ts`
- `src/stores/appSettingsStore.ts`
- `src/hooks/useAppSettings.ts`
- `src/features/admin/pages/AdminSettingsPage.tsx`
- `docs/CANCELLATION_POLICY_FEATURE.md`

### Modified
- `src/features/admin/pages/AdminDashboardPage.tsx` - Add quick action
- `src/app/router/index.tsx` - Add settings route
- `src/features/admin/index.ts` - Export settings page
- `src/features/client/hooks/useUserBookings.ts` - Dynamic validation
- `src/features/client/pages/MyBookingsPage.tsx` - Dynamic UI text
- `src/services/index.ts` - Export appSettingsService
- `src/stores/index.ts` - Export appSettingsStore
- `src/hooks/index.ts` - Export useAppSettings
- `src/types/database.ts` - Add app_settings table types

## Testing Scenarios

1. **Admin sets 24 hours policy**
   - Client cannot cancel booking less than 24h before start time
   - Client can cancel booking more than 24h before start time

2. **Admin sets 2 hours policy**
   - Client cannot cancel booking less than 2h before start time
   - Client can cancel booking more than 2h before start time

3. **Admin sets 1 day policy**
   - Equivalent to 24 hours
   - Same validation applies

4. **Edge cases**
   - Booking in the past: Cannot cancel
   - Booking already cancelled: Cannot cancel again
   - System handles timezone correctly
