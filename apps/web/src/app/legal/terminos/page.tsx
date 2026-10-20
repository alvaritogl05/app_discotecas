import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "@/components/ui/icons";

export const metadata: Metadata = { title: "Términos" };

/**
 * Términos y condiciones iniciales.
 * DOCUMENTO PENDIENTE DE REVISIÓN JURÍDICA antes del lanzamiento público.
 */
export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 animate-fade-in">
      <Link href="/" className="btn-ghost mb-6 -ml-3 inline-flex">
        <ArrowLeftIcon className="size-4" />
        Volver
      </Link>
      <h1 className="mb-2 text-2xl font-bold">Términos de uso</h1>
      <p className="mb-6 rounded-xl border border-warning/40 bg-warning/10 p-3 text-sm text-warning">
        Documento inicial pendiente de revisión jurídica profesional antes del
        lanzamiento público.
      </p>

      <div className="space-y-5 text-sm leading-relaxed text-text-secondary">
        <section>
          <h2 className="mb-1 font-semibold text-text">1. Edad mínima</h2>
          <p>
            Debes ser mayor de 18 años para usar App Discotecas. El incumplimiento
            supone la suspensión inmediata de la cuenta.
          </p>
        </section>
        <section>
          <h2 className="mb-1 font-semibold text-text">2. Conducta esperada</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Respeto en todos los mensajes e interacciones.</li>
            <li>Prohibido el acoso, el fraude, el spam y la suplantación de identidad.</li>
            <li>Prohibido publicar contenido ilegal o no consentido de terceros.</li>
          </ul>
        </section>
        <section>
          <h2 className="mb-1 font-semibold text-text">3. Moderación</h2>
          <p>
            El equipo puede revisar denuncias, suspender cuentas y retirar
            contenido que vulnere estos términos. Las acciones administrativas
            quedan registradas internamente.
          </p>
        </section>
        <section>
          <h2 className="mb-1 font-semibold text-text">4. Asistencia a locales</h2>
          <p>
            Confirmar tu asistencia o hacer check-in es voluntario y reversible.
            Las cifras mostradas reflejan lo que la comunidad decide compartir y
            no constituyen el aforo ni el estado real de un establecimiento.
          </p>
        </section>
        <section>
          <h2 className="mb-1 font-semibold text-text">5. Sin garantía de encuentros</h2>
          <p>
            La app facilita el descubrimiento de personas y planes; no garantiza
            que se produzcan encuentros ni asume responsabilidad por los planes
            acordados entre usuarios fuera de la plataforma.
          </p>
        </section>
      </div>

      <p className="mt-8 text-xs text-text-muted">Última actualización: 20 de octubre de 2026.</p>
    </main>
  );
}
