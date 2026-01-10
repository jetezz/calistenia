import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'sonner'
import { LoadingSpinner } from '@/components/common'

type Mode = 'login' | 'register'

export function LoginForm() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const { signInWithEmail, signUpWithEmail } = useAuth()
  const navigate = useNavigate()

  const translateError = (message: string): string => {
    if (message.includes('Invalid login credentials')) {
      return 'Credenciales incorrectas'
    }
    if (message.includes('Email not confirmed')) {
      return 'Debes confirmar tu correo electronico'
    }
    if (message.includes('is invalid') || message.includes('invalid_email')) {
      return 'Error de configuracion: desactiva "Confirm email" en Supabase Dashboard → Auth → Providers'
    }
    if (message.includes('already registered')) {
      return 'Este correo ya esta registrado'
    }
    if (message.includes('Password should be at least')) {
      return 'La contrasena debe tener al menos 6 caracteres'
    }
    if (message.includes('rate limit') || message.includes('Email rate limit')) {
      return 'Limite de emails alcanzado. Espera unos minutos.'
    }
    if (message.includes('Signups not allowed')) {
      return 'Registros deshabilitados. Activa "Enable Sign Ups" en Supabase.'
    }
    return message
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)
    setIsLoading(true)

    try {
      if (mode === 'login') {
        const { error } = await signInWithEmail(email, password)
        if (error) {
          toast.error(translateError(error.message))
        } else {
          toast.success('Bienvenido a Calistenia Emérita')
          navigate('/')
        }
      } else {
        const { error } = await signUpWithEmail(email, password, fullName)
        if (error) {
          toast.error(translateError(error.message))
        } else {
          toast.success('Cuenta creada. Esperando confirmacion del administrador.')
          setMode('login')
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setError(null)
    setSuccessMessage(null)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          {mode === 'login' ? 'Iniciar Sesion' : 'Crear Cuenta'}
        </CardTitle>
        <CardDescription>
          {mode === 'login' 
            ? 'Accede a tu cuenta de Calistenia Emerita' 
            : 'Unete a la familia Calistenia Emerita'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre completo</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Tu nombre"
                required={mode === 'register'}
                className="h-12"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Correo electronico</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contrasena</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              minLength={6}
              className="h-12"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          {successMessage && (
            <p className="text-sm text-green-600 text-center">{successMessage}</p>
          )}

          <Button 
            type="submit" 
            className="w-full h-12 text-base"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                <span>Cargando...</span>
              </div>
            ) : (
              mode === 'login' ? 'Entrar' : 'Crear cuenta'
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {mode === 'login' ? 'No tienes cuenta?' : 'Ya tienes cuenta?'}{' '}
          <button
            type="button"
            onClick={toggleMode}
            className="font-medium text-primary hover:underline"
          >
            {mode === 'login' ? 'Registrate' : 'Inicia sesion'}
          </button>
        </p>
      </CardContent>
    </Card>
  )
}
