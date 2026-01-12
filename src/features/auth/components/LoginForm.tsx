import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/common";

type Mode = "login" | "register";

export function LoginForm() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const translateError = (message: string): string => {
    if (message.includes("Invalid login credentials")) {
      return "Credenciales incorrectas";
    }
    if (message.includes("Email not confirmed")) {
      return "Debes confirmar tu correo electronico";
    }
    if (message.includes("is invalid") || message.includes("invalid_email")) {
      return 'Error de configuracion: desactiva "Confirm email" en Supabase Dashboard → Auth → Providers';
    }
    if (message.includes("already registered")) {
      return "Este correo ya esta registrado";
    }
    if (message.includes("Password should be at least")) {
      return "La contrasena debe tener al menos 6 caracteres";
    }
    if (
      message.includes("rate limit") ||
      message.includes("Email rate limit")
    ) {
      return "Limite de emails alcanzado. Espera unos minutos.";
    }
    if (message.includes("Signups not allowed")) {
      return 'Registros deshabilitados. Activa "Enable Sign Ups" en Supabase.';
    }
    return message;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (mode === "login") {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          toast.error(translateError(error.message));
        } else {
          toast.success("Bienvenido a Calistenia Emérita");
          navigate("/app");
        }
      } else {
        const { error } = await signUpWithEmail(email, password, fullName);
        if (error) {
          toast.error(translateError(error.message));
        } else {
          toast.success(
            "Cuenta creada. Esperando confirmacion del administrador."
          );
          setMode("login");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const { error } = await signInWithGoogle();
      if (error) {
        toast.error("Error al conectar con Google");
        console.error(error);
      }
      // Redirection is handled by Supabase
    } catch (err) {
      toast.error("Error inesperado al intentar con Google");
      console.error(err);
    } finally {
      // Keep loading state if redirecting, though usually state is lost on redirect.
      // But if it fails, turn off loading.
      // If successful, we redirect away, so setting false doesn't hurt.
      // Actually, if we redirect, we might prefer to keep loading to avoid UI flash?
      // But setIsLoading(false) is safer in case redirect doesn't happen immediately or fails.
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          {mode === "login" ? "Iniciar Sesion" : "Crear Cuenta"}
        </CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Accede a tu cuenta de Calistenia Emerita"
            : "Unete a la familia Calistenia Emerita"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre completo</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Tu nombre"
                required={mode === "register"}
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
            <p className="text-sm text-green-600 text-center">
              {successMessage}
            </p>
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
            ) : mode === "login" ? (
              "Entrar"
            ) : (
              "Crear cuenta"
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                O continuar con
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-12"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.-.19-.58z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {mode === "login" ? "No tienes cuenta?" : "Ya tienes cuenta?"}{" "}
          <button
            type="button"
            onClick={toggleMode}
            className="font-medium text-primary hover:underline"
          >
            {mode === "login" ? "Registrate" : "Inicia sesion"}
          </button>
        </p>
      </CardContent>
    </Card>
  );
}
