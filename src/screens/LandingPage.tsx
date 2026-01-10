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
  ArrowDown,
  Star,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useBrandingSettings } from "@/hooks/admin/Branding/useBrandingSettings";
import { PageLoadingState } from "@/components/common";
import { cn } from "@/lib/utils";

export function LandingPage() {
  const { settings, isLoading } = useBrandingSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!navRef.current) return;

      const scrollY = window.scrollY;
      const maxScroll = 600; // Range for full transition

      // Calculate opacity (0 to 0.9) linearly
      const rawProgress = Math.min(scrollY / maxScroll, 1);
      const opacity = rawProgress * 0.9;

      // Calculate blur (0 to 12px)
      const blur = rawProgress * 12;

      // Update CSS variables directly for simple, performant 60fps animation
      // preventing React re-renders on every scroll tick
      navRef.current.style.setProperty("--header-opacity", opacity.toString());
      navRef.current.style.setProperty("--header-blur", `${blur}px`);

      // Toggle state only when threshold is crossed to switch text colors
      // Using 150px as the threshold for text contrast change
      const shouldBeScrolled = scrollY > 150;
      if (shouldBeScrolled !== isScrolled) {
        // Check previous state to avoid unnecessary updates
        setIsScrolled((prev) => {
          if (prev !== shouldBeScrolled) return shouldBeScrolled;
          return prev;
        });
      }
    };

    // Use requestAnimationFrame for smoother performance
    let rafId: number;
    const onScroll = () => {
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    // Initial call
    handleScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [isScrolled]); // Depend on isScrolled to allow the closure to see the latest one, or use functional update

  if (isLoading || !settings) {
    return <PageLoadingState message="Cargando experiencia..." />;
  }

  const whatsappUrl = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp}?text=Hola,%20me%20gustaría%20solicitar%20una%20entrevista%20gratuita`
    : "#";

  const visibleTestimonials = settings.testimonials.filter((t) => t.visible);

  return (
    <div className="landing-page min-h-screen bg-white font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navigation Bar - Modern & Glassmorphism */}
      <nav
        ref={navRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out border-b", // Slower CSS transition
          isScrolled
            ? "border-emerald-100/20 py-3 shadow-lg shadow-emerald-900/5"
            : "border-transparent py-6"
        )}
        style={{
          // Use CSS variables updated via JS ref for instant, lag-free updates
          backgroundColor: `rgba(255, 255, 255, var(--header-opacity, 0))`,
          backdropFilter: `blur(var(--header-blur, 0px))`,
          WebkitBackdropFilter: `blur(var(--header-blur, 0px))`,
        }}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            {settings.show_logo && settings.logo_url && (
              <div className="relative">
                <div
                  className={cn(
                    "absolute inset-0 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                    isScrolled ? "bg-emerald-500/20" : "bg-white/20"
                  )}
                />
                <img
                  src={settings.logo_url}
                  alt={settings.business_name || "Logo"}
                  className="h-10 w-10 md:h-12 md:w-12 object-contain relative z-10"
                />
              </div>
            )}
            <span
              className={cn(
                "text-xl md:text-2xl font-bold tracking-tight transition-colors duration-300",
                isScrolled
                  ? "text-gray-900 group-hover:text-emerald-700"
                  : "text-white group-hover:text-emerald-200"
              )}
            >
              {settings.business_name || "Calistenia Emérita"}
            </span>
          </Link>

          <Button
            variant="ghost"
            className={cn(
              "hidden md:flex font-medium transition-colors hover:bg-white/10",
              isScrolled
                ? "text-emerald-700 hover:bg-emerald-50"
                : "text-white hover:text-emerald-200"
            )}
            asChild
          >
            <Link to="/login">Área Clientes</Link>
          </Button>
        </div>
      </nav>

      {/* Floating WhatsApp Button - Modern Pulse */}
      {settings.show_whatsapp && settings.whatsapp && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-8 right-8 z-50 group"
          aria-label="Contactar por WhatsApp"
        >
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-25 group-hover:opacity-40" />
          <div className="relative bg-linear-to-tr from-green-600 to-green-500 text-white p-4 rounded-full shadow-2xl hover:shadow-green-500/30 transition-all duration-300 hover:scale-110 flex items-center justify-center">
            <Phone className="w-6 h-6 md:w-7 md:h-7" />
          </div>
        </a>
      )}

      {/* Hero Section - Immersive & Premium */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Visual Background */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 animate-[kenburns_20s_infinite_alternate]"
            style={{
              backgroundImage: `url(${
                settings.hero_image_url || "/hero-background.png"
              })`,
            }}
          />
          <div className="absolute inset-0 bg-linear-to-b from-gray-900/60 via-gray-900/50 to-gray-900/90" />
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-20 text-center">
          <div className="animate-fade-in-up space-y-8 max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium mb-4 animate-fade-in-delay">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Plazas limitadas • Grupos reducidos
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tight text-balance drop-shadow-xl">
              {settings.hero_title ||
                "Recupera tu fuerza sin el caos del gimnasio"}
            </h1>

            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto font-light leading-relaxed text-balance opacity-90">
              {settings.hero_subtitle ||
                "Entrenamiento personal exclusivo en Mérida. Especialistas en salud y movilidad para mayores de 40."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button
                size="lg"
                className="h-14 px-8 text-lg rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.6)] transition-all duration-300 hover:scale-105 border-0"
                asChild
              >
                <a href="#contact" className="font-bold tracking-wide">
                  {settings.hero_cta_text || "Solicitar Entrevista"}
                  <ChevronRight className="ml-2 w-5 h-5" />
                </a>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg rounded-full bg-white/5 backdrop-blur-sm border-white/20 text-white hover:bg-white hover:text-emerald-900 transition-all duration-300"
                asChild
              >
                <a href="#benefits">Descubre más</a>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 animate-bounce hidden md:block">
          <ArrowDown className="w-8 h-8" />
        </div>
      </section>

      {/* Empathy Section - Modern Cards */}
      <section
        id="benefits"
        className="py-24 md:py-32 bg-gray-50 relative overflow-hidden"
      >
        {/* Background blobs */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-orange-100 rounded-full blur-3xl opacity-50" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              {settings.empathy_title || "¿Te sientes identificado?"}
            </h2>
            <p className="text-xl text-gray-600">
              {settings.empathy_subtitle ||
                "Entendemos que buscas calidad, no cantidad."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                icon: AlertCircle,
                color: "text-orange-500",
                bg: "bg-orange-50",
                border: "group-hover:border-orange-200",
                title: "Miedo a lesionarte",
                desc: "Los ejercicios mal ejecutados son un riesgo. Aquí la técnica es la prioridad absoluta.",
              },
              {
                icon: Users,
                color: "text-rose-500",
                bg: "bg-rose-50",
                border: "group-hover:border-rose-200",
                title: "Gimnasios Masificados",
                desc: "Olvídate de esperar máquinas o sentir miradas. Entrena en privacidad y calma.",
              },
              {
                icon: Target,
                color: "text-blue-500",
                bg: "bg-blue-50",
                border: "group-hover:border-blue-200",
                title: "Dolor de Espalda",
                desc: "El sedentarismo pasa factura. Recupera tu movilidad y vive sin dolores.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={cn(
                  "group bg-white rounded-3xl p-8 shadow-lg shadow-gray-200/50 border border-gray-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl",
                  item.border
                )}
              >
                <div
                  className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110",
                    item.bg
                  )}
                >
                  <item.icon className={cn("w-8 h-8", item.color)} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition - Dark & Sleek */}
      <section className="py-24 md:py-32 bg-[#0f172a] text-white relative overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20 space-y-4">
            <span className="text-emerald-400 font-semibold tracking-wider uppercase text-sm">
              Metodología Única
            </span>
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400">
              {settings.value_prop_title}
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {settings.value_prop_subtitle ||
                "Un enfoque artesanal para tu bienestar físico."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: Shield,
                title: "Privacidad Total",
                desc: "Entorno controlado. Sin distracciones. Solo tú y tu progreso personal.",
              },
              {
                icon: Users,
                title: "Ratio 1:4",
                desc: "Casi un entrenamiento personal. Supervisión milimétrica en cada repetición.",
              },
              {
                icon: Heart,
                title: "Humano & Cercano",
                desc: "Creamos comunidad. Aquí nos conocemos todos por nuestro nombre.",
              },
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="absolute inset-0 bg-linear-to-r from-emerald-500/20 to-emerald-900/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                <div className="relative h-full bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors duration-300">
                  <div className="bg-linear-to-br from-emerald-500 to-emerald-700 w-14 h-14 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/50 mb-6 group-hover:rotate-6 transition-transform duration-300">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-lg">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trainer Section - Asymmetrical Layout */}
      {settings.show_trainer_image !== false && (
        <section className="py-24 md:py-32 bg-white overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1 relative">
                {/* Decorative Elements */}
                <div className="absolute -top-10 -left-10 w-20 h-20 bg-emerald-100 rounded-full blur-xl" />
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-orange-50 rounded-full blur-xl" />

                <div className="relative space-y-8">
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                    {settings.about_trainer_title || "Tu Entrenador"}
                  </h2>
                  <div className="prose prose-lg text-gray-600">
                    <p className="text-lg leading-relaxed whitespace-pre-line">
                      {settings.about_trainer_text ||
                        "Más que un entrenador, soy tu compañero en este viaje. Con años de experiencia ayudando a personas reales a conseguir resultados reales."}
                    </p>
                  </div>

                  <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-xl">
                    <div className="flex gap-4">
                      <Quote className="w-8 h-8 text-emerald-600 opacity-50 shrink-0" />
                      <p className="text-xl font-medium text-emerald-900 italic">
                        "
                        {settings.about_trainer_quote ||
                          "No eres un número, eres parte de la familia."}
                        "
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4">
                    {[
                      "Certificado Profesional",
                      "+5 Años Experiencia",
                      "Especialista +40",
                    ].map((tag, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-gray-700 font-medium"
                      >
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2 relative group perspective-1000">
                <div className="absolute inset-0 bg-emerald-600 rounded-3xl rotate-3 scale-95 opacity-20 group-hover:rotate-6 transition-transform duration-500" />
                <img
                  src={settings.trainer_image_url || "/trainer-photo.png"}
                  alt="Entrenador personal"
                  className="relative z-10 w-full object-cover aspect-4/5 rounded-3xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.02] group-hover:-rotate-1"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials & Location - Split View */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">
              Resultados Reales en {settings.city}
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Map Card */}
            {settings.show_location && (
              <div className="bg-white rounded-3xl p-3 shadow-xl h-full flex flex-col">
                <div className="relative grow min-h-[400px] rounded-2xl overflow-hidden group">
                  {settings.google_maps_url ? (
                    <iframe
                      src={settings.google_maps_url}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Ubicación"
                      className="absolute inset-0 w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-emerald-50 flex flex-col items-center justify-center p-8 text-center">
                      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                        <MapPin className="w-10 h-10 text-emerald-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {settings.business_name}
                      </h3>
                      <p className="text-gray-600 mt-2">
                        {settings.city}, {settings.region}
                      </p>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="w-5 h-5 text-emerald-500" />
                    <span className="font-medium">
                      {settings.address ||
                        `${settings.city}, ${settings.region}`}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Testimonials Stack */}
            <div className="space-y-6">
              {visibleTestimonials.length > 0 ? (
                visibleTestimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:border-emerald-200 transition-colors"
                  >
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 text-lg italic mb-6 leading-relaxed">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-linear-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-emerald-600">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white p-8 rounded-3xl shadow-lg text-center py-20">
                  <p className="text-gray-500">
                    Pronto verás las historias de éxito aquí.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Final Push */}
      <section
        id="contact"
        className="py-32 relative overflow-hidden flex items-center justify-center bg-emerald-900"
      >
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
        <div className="absolute inset-0 bg-linear-to-t from-emerald-950 to-transparent" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
              {settings.final_cta_title || "Tu mejor versión empieza hoy"}
            </h2>
            <p className="text-xl md:text-2xl text-emerald-100/80 max-w-2xl mx-auto">
              {settings.final_cta_subtitle ||
                "Las plazas son extremadamente limitadas. No dejes pasar tu oportunidad."}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              {settings.show_whatsapp && settings.whatsapp && (
                <Button
                  size="lg"
                  className="h-16 px-10 text-xl rounded-full bg-white text-emerald-900 hover:bg-gray-100 hover:scale-105 transition-all shadow-2xl"
                  asChild
                >
                  <a href={whatsappUrl}>
                    <Phone className="mr-3 w-6 h-6" />
                    Solicitar Entrevista
                  </a>
                </Button>
              )}

              <Button
                size="lg"
                variant="outline"
                className="h-16 px-10 text-xl rounded-full border-2 border-emerald-500/50 text-white hover:bg-emerald-800 hover:border-emerald-400 transition-all bg-transparent backdrop-blur-sm"
                asChild
              >
                <Link to="/login">
                  Ya soy cliente
                  <ChevronRight className="ml-2 w-6 h-6" />
                </Link>
              </Button>
            </div>

            <p className="text-sm text-emerald-400/60 mt-8">
              Sin compromiso • Totalmente gratuito
            </p>
          </div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="bg-emerald-950 text-emerald-200/60 py-16 border-t border-emerald-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {settings.business_name}
              </h3>
              <p className="max-w-sm text-lg leading-relaxed">
                Transformando vidas a través del movimiento consciente. Salud,
                fuerza y comunidad en {settings.city}.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-6 uppercase tracking-wider text-sm">
                Contacto
              </h4>
              <div className="space-y-4">
                {settings.show_phone && settings.phone && (
                  <a
                    href={`tel:${settings.phone}`}
                    className="flex items-center gap-3 hover:text-white transition-colors"
                  >
                    <Phone className="w-5 h-5" /> {settings.phone}
                  </a>
                )}
                {settings.show_email && settings.email && (
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-center gap-3 hover:text-white transition-colors"
                  >
                    <Mail className="w-5 h-5" /> {settings.email}
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
                    className="flex items-center gap-3 hover:text-white transition-colors"
                  >
                    <Instagram className="w-5 h-5" /> {settings.instagram}
                  </a>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-6 uppercase tracking-wider text-sm">
                Legal
              </h4>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Aviso Legal
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacidad
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-emerald-900 pt-8 text-center text-sm">
            <p>
              © {new Date().getFullYear()} {settings.business_name}. Todos los
              derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
