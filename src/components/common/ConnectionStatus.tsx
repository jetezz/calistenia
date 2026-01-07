import { useSupabaseConnection } from '@/hooks/useSupabaseConnection'

export function ConnectionStatus() {
  const { isConnected, isLoading, error } = useSupabaseConnection()

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-slate-500">
        <span className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
        Connecting to Supabase...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <span className="w-3 h-3 bg-red-500 rounded-full" />
        Connection error: {error}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-green-600">
      <span className="w-3 h-3 bg-green-500 rounded-full" />
      {isConnected ? 'Connected to Supabase' : 'Not connected'}
    </div>
  )
}
