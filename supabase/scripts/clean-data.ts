import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../../src/types/database'

config()

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

async function cleanAllData() {
  console.log('🧹 Starting database cleanup...')
  console.log('⚠️  WARNING: This will delete all data except user profiles\n')

  const adminEmail = process.env.VITE_ADMIN_EMAIL
  const adminPassword = process.env.VITE_ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    throw new Error('Admin credentials not found. Please set VITE_ADMIN_EMAIL and VITE_ADMIN_PASSWORD in .env file')
  }

  try {
    console.log('🔐 Authenticating as admin...')
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword
    })

    if (authError) throw authError
    if (!authData.user) throw new Error('Authentication failed')
    
    console.log('✅ Authenticated successfully\n')

    console.log('📅 Deleting bookings...')
    const { data: bookings } = await supabase.from('bookings').select('id')
    if (bookings && bookings.length > 0) {
      const { error: bookingsError } = await supabase
        .from('bookings')
        .delete()
        .in('id', bookings.map(b => b.id))
      if (bookingsError) throw bookingsError
      console.log(`✅ ${bookings.length} bookings deleted`)
    } else {
      console.log('✅ No bookings to delete')
    }

    console.log('💳 Deleting payment requests...')
    const { data: paymentRequests } = await supabase.from('payment_requests').select('id')
    if (paymentRequests && paymentRequests.length > 0) {
      const { error: paymentRequestsError } = await supabase
        .from('payment_requests')
        .delete()
        .in('id', paymentRequests.map(p => p.id))
      if (paymentRequestsError) throw paymentRequestsError
      console.log(`✅ ${paymentRequests.length} payment requests deleted`)
    } else {
      console.log('✅ No payment requests to delete')
    }

    console.log('� Deleting pricing packages...')
    const { data: pricingPackages } = await supabase.from('pricing_packages').select('id')
    if (pricingPackages && pricingPackages.length > 0) {
      const { error: pricingError } = await supabase
        .from('pricing_packages')
        .delete()
        .in('id', pricingPackages.map(p => p.id))
      if (pricingError) throw pricingError
      console.log(`✅ ${pricingPackages.length} pricing packages deleted`)
    } else {
      console.log('✅ No pricing packages to delete')
    }

    console.log('💰 Deleting payment methods...')
    const { data: paymentMethods } = await supabase.from('payment_methods').select('id')
    if (paymentMethods && paymentMethods.length > 0) {
      const { error: paymentMethodsError } = await supabase
        .from('payment_methods')
        .delete()
        .in('id', paymentMethods.map(m => m.id))
      if (paymentMethodsError) throw paymentMethodsError
      console.log(`✅ ${paymentMethods.length} payment methods deleted`)
    } else {
      console.log('✅ No payment methods to delete')
    }

    console.log('�🕐 Deleting time slots...')
    const { data: timeSlots } = await supabase.from('time_slots').select('id')
    if (timeSlots && timeSlots.length > 0) {
      const { error: timeSlotsError } = await supabase
        .from('time_slots')
        .delete()
        .in('id', timeSlots.map(t => t.id))
      if (timeSlotsError) throw timeSlotsError
      console.log(`✅ ${timeSlots.length} time slots deleted`)
    } else {
      console.log('✅ No time slots to delete')
    }

    console.log('🔄 Resetting user credits to 0...')
    const { data: profiles } = await supabase.from('profiles').select('id')
    if (profiles && profiles.length > 0) {
      const { error: creditsError } = await supabase
        .from('profiles')
        .update({ credits: 0 })
        .in('id', profiles.map(p => p.id))
      if (creditsError) throw creditsError
      console.log(`✅ ${profiles.length} user credits reset`)
    } else {
      console.log('✅ No user credits to reset')
    }

    console.log('\n✨ Database cleanup completed successfully!')
    console.log('ℹ️  User profiles have been preserved')

    await supabase.auth.signOut()
    
  } catch (error) {
    console.error('\n❌ Error during cleanup:', error)
    throw error
  }
}

cleanAllData()
  .then(() => {
    console.log('\n👋 Script finished')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error)
    process.exit(1)
  })
