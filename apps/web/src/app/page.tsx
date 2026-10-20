import Link from "next/link";
import { APP_TAGLINE } from "@app-discotecas/shared";
import {
  BoltIcon,
  ChatIcon,
  CompassIcon,
  MapPinIcon,
  ShieldIcon,
  SparkIcon,
} from "@/components/ui/icons";
import { ButtonLink } from "@/components/ui/Button";

const FEATURES = [
  {
    icon: CompassIcon,
    title: "Discotecas reales",
    text: "Locales verificables de Barcelona y alrededores, con música, dirección y asistencia de la comunidad.",
  },
  {
    icon: SparkIcon,
    title: "Quién sale esta noche",
    text: "Descubre perfiles de personas que han decidido compartir su plan para una fecha o local concreto.",
  },
  {
    icon: BoltIcon,
    title: "Matches y chat",
    text: "Cuando el interés es mutuo, el chat privado se abre automáticamente. Sin mensajes no deseados.",
  },
  {
    icon: MapPinIcon,
    title: "Confirmas tú, decides tú",
    text: "Anuncia tu plan, confirma tu asistencia o haz check-in al llegar. Todo es voluntario y reversible.",
  },
  {
    icon: ChatIcon,
    title: "Grupos de amigos",
    text: "Crea tu grupo, invita a tu gente y coordina el plan de la noche en un solo sitio.",
  },
  {
    icon: ShieldIcon,
    title: "Privacidad por diseño",
    text: "Solo mayores de 18. Tu ubicación exacta nunca es pública. Bloqueo y denuncia integrados.",
  },
] as const;

export default function HomePage() {
  return (
    <div className="relative z-10">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <span className="text-lg font-black tracking-tight">
          <span className="neon-text">App Discotecas</span>
        </span>
        <nav className="flex items-center gap-2">
          <Link href="/login" className="btn-ghost">
            Entrar
          </Link>
          <Link href="/login?modo=registro" className="btn-primary">
            Crear cuenta
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-16 pt-10 text-center sm:px-6 sm:pt-16">
        <p className="mx-auto mb-4 w-fit rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-text-secondary">
          Barcelona y alrededores · Solo mayores de 18
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">
          <span className="neon-text">{APP_TAGLINE}</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-text-secondary sm:text-lg">
          Descubre discotecas, sabe quién tiene previsto salir, conoce gente con
          tus mismos gustos y organiza el plan de esta noche.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/login?modo=registro" className="w-full sm:w-auto">
            Empezar ahora
          </ButtonLink>
          <ButtonLink href="/login" variant="secondary" className="w-full sm:w-auto">
            Ya tengo cuenta
          </ButtonLink>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6" aria-labelledby="funciones">
        <h2 id="funciones" className="sr-only">
          Qué puedes hacer
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="surface p-5 transition hover:bg-surface-raised">
                <Icon className="mb-3 size-6 text-neon-violet" />
                <h3 className="mb-1.5 font-semibold text-text">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-text-secondary">{feature.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="neon-border rounded-3xl p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold sm:text-3xl">¿Sale esta noche?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-text-secondary sm:text-base">
            Crea tu perfil en minutos y descubre quién más tiene el plan hecho.
          </p>
          <div className="mt-6">
            <ButtonLink href="/login?modo=registro">Crear mi perfil</ButtonLink>
          </div>
        </div>
      </section>

      <footer className="border-t border-line px-4 py-8 text-center text-xs text-text-muted sm:px-6">
        <p>
          App Discotecas es un proyecto en desarrollo. Los estableciones provienen
          de OpenStreetMap (© OpenStreetMap contributors, ODbL).
        </p>
        <p className="mt-2">
          <Link href="/legal/privacidad" className="underline hover:text-text-secondary">
            Política de privacidad
          </Link>{" "}
          ·{" "}
          <Link href="/legal/terminos" className="underline hover:text-text-secondary">
            Términos
          </Link>
        </p>
      </footer>
    </div>
  );
}
