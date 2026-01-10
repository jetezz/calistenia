import {
  Shield,
  Users,
  Heart,
  MapPin,
  Instagram,
  Phone,
  Mail,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useBrandingSettings } from "@/hooks/admin/Branding/useBrandingSettings";
import { PageLoadingState } from "@/components/common";

export function LandingPage() {
  const { settings, isLoading } = useBrandingSettings();

  if (isLoading || !settings) {
    return <PageLoadingState message="Cargando..." />;
  }

  const whatsappUrl = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp}?text=Hola,%20me%20gustaría%20solicitar%20una%20entrevista%20gratuita`
    : "#";

  const visibleTestimonials = settings.testimonials.filter((t) => t.visible);

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex flex-col items-center gap-2">
            {/* Logo */}
            {settings.show_logo && settings.logo_url && (
              <img
                src={settings.logo_url}
                alt={settings.business_name || "Logo"}
                className="h-12 w-12 object-contain"
              />
            )}

            {/* Business Name */}
            <span className="text-xl font-bold text-gray-900">
              {settings.business_name || "Calistenia Emérita"}
            </span>
          </Link>
        </div>
      </nav>

      {/* Fixed WhatsApp Button */}
      {settings.show_whatsapp && settings.whatsapp && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 animate-pulse"
          aria-label="Contactar por WhatsApp"
        >
          <Phone className="size-6" />
        </a>
      )}

      {/* Hero Section */}
      <section className="hero-section relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Always show background image - either custom or default */}
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${
                settings.hero_image_url || "/hero-background.png"
              })`,
              filter: "brightness(0.7)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </>

        <div className="relative z-10 container mx-auto px-4 py-20 text-center text-white">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in">
            {settings.hero_title ||
              "Recupera tu agilidad y fuerza sin el ambiente de un gimnasio tradicional"}
          </h1>

          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200 animate-fade-in-delay">
            {settings.hero_subtitle ||
              "Entrenamiento personal en grupos reducidos (máximo 4 personas) en Mérida. Especialistas en salud, movilidad y calistenia para mayores de 40."}
          </p>

          <Button
            size="lg"
            className="bg-emerald-500 hover:bg-emerald-600 text-white text-lg px-8 py-6 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in-delay-2"
            asChild
          >
            <a href="#contact">
              {settings.hero_cta_text || "Solicitar Entrevista Gratuita"}
              <ChevronRight className="ml-2 size-5" />
            </a>
          </Button>
        </div>
      </section>

      {/* Empathy Section - Pain Points */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">
              {settings.empathy_title || "¿Te suena esto?"}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {settings.empathy_subtitle ||
                "Entendemos que no buscas un cuerpo de revista, sino atarte los cordones sin dolor"}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 border-orange-200 bg-orange-50/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="bg-orange-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <AlertCircle className="size-10 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  Miedo a lesionarte
                </h3>
                <p className="text-gray-700">
                  Los ejercicios mal ejecutados pueden causar más daño que
                  beneficio. Necesitas supervisión profesional.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-200 bg-red-50/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Users className="size-10 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  Vergüenza en gimnasios masificados
                </h3>
                <p className="text-gray-700">
                  Los grandes gimnasios pueden ser intimidantes. Prefieres un
                  ambiente más íntimo y privado.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 bg-blue-50/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="bg-blue-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Target className="size-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  Dolor de espalda por trabajo de oficina
                </h3>
                <p className="text-gray-700">
                  Largas horas sentado han pasado factura. Necesitas recuperar
                  movilidad y fuerza.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-gradient-to-b from-emerald-900 to-emerald-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {settings.value_prop_title}
            </h2>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              {settings.value_prop_subtitle ||
                "Un enfoque personalizado que prioriza tu salud y bienestar"}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="bg-emerald-500 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-xl">
                <Shield className="size-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Privacidad Total</h3>
              <p className="text-emerald-100 text-lg">
                Entorno controlado y acogedor. Sin miradas, sin presión. Solo tú
                y tu progreso.
              </p>
            </div>

            <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="bg-emerald-500 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-xl">
                <Users className="size-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Seguridad (Ratio 1:4)</h3>
              <p className="text-emerald-100 text-lg">
                Un entrenador para solo 4 personas. Supervisión total para
                evitar lesiones y maximizar resultados.
              </p>
            </div>

            <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="bg-emerald-500 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-xl">
                <Heart className="size-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Metodología Inclusiva</h3>
              <p className="text-emerald-100 text-lg">
                Calistenia adaptada a cualquier edad y condición física. Tu
                ritmo, tus objetivos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trainer Section */}
      {settings.show_trainer_image !== false && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                    {settings.about_trainer_title || "Tu Entrenador Personal"}
                  </h2>
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed whitespace-pre-line">
                    {settings.about_trainer_text ||
                      "Con años de experiencia en entrenamiento funcional y calistenia, mi enfoque está en el acompañamiento personal y la creación de una verdadera comunidad."}
                  </p>
                  <blockquote className="border-l-4 border-emerald-500 pl-6 italic text-xl text-gray-800 mb-6">
                    "
                    {settings.about_trainer_quote ||
                      "No eres un número, eres parte de la familia."}
                    "
                  </blockquote>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <CheckCircle2 className="size-5 text-emerald-500" />
                      <span>Certificado profesional</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <CheckCircle2 className="size-5 text-emerald-500" />
                      <span>+5 años de experiencia</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <CheckCircle2 className="size-5 text-emerald-500" />
                      <span>Especialista en +40 años</span>
                    </div>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <img
                    src={settings.trainer_image_url || "/trainer-photo.png"}
                    alt="Entrenador personal"
                    className="rounded-2xl shadow-2xl w-full object-cover aspect-square"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Social Proof & Location */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">
                Tu Entrenador Personal de Calistenia en {settings.city}
              </h2>
              {settings.show_location && (
                <p className="text-xl text-gray-600">
                  Ubicados en {settings.city}, {settings.region}
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Map */}
              {settings.show_location && (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  {settings.google_maps_url ? (
                    <iframe
                      src={settings.google_maps_url}
                      width="100%"
                      height="400"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Ubicación"
                    />
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                      <div className="text-center p-8">
                        <MapPin className="size-16 text-emerald-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {settings.business_name}
                        </h3>
                        <p className="text-gray-700">
                          {settings.city}, {settings.region}
                        </p>
                        {settings.address && (
                          <p className="text-sm text-gray-600 mt-2">
                            {settings.address}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Testimonials */}
              {visibleTestimonials.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Lo que dicen nuestros clientes
                  </h3>

                  {visibleTestimonials.map((testimonial) => (
                    <Card
                      key={testimonial.id}
                      className="border-2 border-emerald-200 bg-white hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="bg-emerald-100 rounded-full p-3">
                            <Heart className="size-6 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">
                              {testimonial.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {testimonial.role}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 italic">
                          "{testimonial.text}"
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="contact"
        className="py-20 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {settings.final_cta_title || "Únete al grupo"}
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-emerald-100">
            {settings.final_cta_subtitle ||
              "Solo 4 plazas por hora. No esperes más para cuidar tu salud."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            {settings.show_whatsapp && settings.whatsapp && (
              <Button
                size="lg"
                className="bg-white text-emerald-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                asChild
              >
                <a href={whatsappUrl}>
                  <Phone className="mr-2 size-5" />
                  WhatsApp: Entrevista Gratuita
                </a>
              </Button>
            )}

            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-emerald-600 text-lg px-8 py-6 rounded-full transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              asChild
            >
              <Link to="/login">
                Acceso Clientes
                <ChevronRight className="ml-2 size-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">
                {settings.business_name}
              </h3>
              <p className="text-gray-400">
                Tu centro de entrenamiento personal y calistenia en{" "}
                {settings.city}. Salud, movilidad y bienestar para mayores de
                40.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">Contacto</h3>
              <div className="space-y-3">
                {settings.show_phone && settings.phone && (
                  <a
                    href={`tel:${settings.phone}`}
                    className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                  >
                    <Phone className="size-4" />
                    {settings.phone}
                  </a>
                )}
                {settings.show_email && settings.email && (
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                  >
                    <Mail className="size-4" />
                    {settings.email}
                  </a>
                )}
                {settings.show_instagram && settings.instagram && (
                  <a
                    href={`https://instagram.com/${settings.instagram.replace(
                      "@",
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                  >
                    <Instagram className="size-4" />
                    {settings.instagram}
                  </a>
                )}
              </div>
            </div>

            {settings.show_schedule && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Horario</h3>
                <div className="space-y-2 text-gray-400">
                  {settings.schedule_weekdays && (
                    <p>{settings.schedule_weekdays}</p>
                  )}
                  {settings.schedule_saturday && (
                    <p>{settings.schedule_saturday}</p>
                  )}
                  {settings.schedule_sunday && (
                    <p>{settings.schedule_sunday}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            <p className="mb-4">
              © {new Date().getFullYear()} {settings.business_name}. Todos los
              derechos reservados.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#" className="hover:text-emerald-400 transition-colors">
                Política de Privacidad
              </a>
              <span>•</span>
              <a href="#" className="hover:text-emerald-400 transition-colors">
                Protección de Datos
              </a>
              <span>•</span>
              <a href="#" className="hover:text-emerald-400 transition-colors">
                Aviso Legal
              </a>
              <span>•</span>
              <a href="#" className="hover:text-emerald-400 transition-colors">
                Política de Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
