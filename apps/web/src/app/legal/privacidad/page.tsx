import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "@/components/ui/icons";

export const metadata: Metadata = { title: "Privacidad" };

/**
 * Política de privacidad inicial.
 * DOCUMENTO PENDIENTE DE REVISIÓN JURÍDICA antes del lanzamiento público.
 */
export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 animate-fade-in">
      <Link href="/" className="btn-ghost mb-6 -ml-3 inline-flex">
        <ArrowLeftIcon className="size-4" />
        Volver
      </Link>
      <h1 className="mb-2 text-2xl font-bold">Política de privacidad</h1>
      <p className="mb-6 rounded-xl border border-warning/40 bg-warning/10 p-3 text-sm text-warning">
        Documento inicial pendiente de revisión jurídica profesional antes del
        lanzamiento público. No constituye asesoramiento legal.
      </p>

      <div className="space-y-5 text-sm leading-relaxed text-text-secondary">
        <section>
          <h2 className="mb-1 font-semibold text-text">1. Responsable y contacto</h2>
          <p>
            App Discotecas (proyecto en desarrollo). Para ejercer tus derechos de
            acceso, rectificación, oposición, limitación o supresión, utiliza las
            opciones de tu perfil o contacta con el equipo del proyecto.
          </p>
        </section>
        <section>
          <h2 className="mb-1 font-semibold text-text">2. Datos que tratamos</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Cuenta de autenticación (correo, teléfono o proveedor social usado para entrar).</li>
            <li>Nombre visible, edad calculada, biografía, intereses y fotos que decides publicar.</li>
            <li>Tus planes de salida y asistencia a locales, solo si decides compartirlos.</li>
            <li>Mensajes privados con personas con las que has hecho match.</li>
          </ul>
          <p className="mt-2">
            No tratamos datos de ubicación exacta: la app no la necesita para
            funcionar. La fecha de nacimiento nunca se publica; solo se muestra tu
            edad.
          </p>
        </section>
        <section>
          <h2 className="mb-1 font-semibold text-text">3. Base jurídica y consentimiento</h2>
          <p>
            El tratamiento se basa en tu consentimiento (registro y uso
            voluntario), en la ejecución del servicio (matches, chat, asistencia)
            y en el interés legítimo en moderar la plataforma. Puedes retirar tu
            consentimiento eliminando tu cuenta.
          </p>
        </section>
        <section>
          <h2 className="mb-1 font-semibold text-text">4. Conservación y eliminación</h2>
          <p>
            Los datos se conservan mientras tu cuenta esté activa. Al eliminar la
            cuenta se borran tus datos del producto (cascada en la base de datos);
            pueden persistir copias de seguridad del proveedor durante un plazo
            limitado, según su política.
          </p>
        </section>
        <section>
          <h2 className="mb-1 font-semibold text-text">5. Destinatarios</h2>
          <p>
            Proveedores técnicos necesarios: Supabase (base de datos,
            autenticación y almacenamiento) y el proveedor de mapas elegido. No
            vendemos datos personales a terceros.
          </p>
        </section>
        <section>
          <h2 className="mb-1 font-semibold text-text">6. Menores de edad</h2>
          <p>
            La plataforma es exclusiva para mayores de 18 años. El registro
            aplica un control de edad en servidor; detectar un perfil menor de
            edad implica suspensión y borrado.
          </p>
        </section>
        <section>
          <h2 className="mb-1 font-semibold text-text">7. Cookies</h2>
          <p>
            Solo usamos cookies técnicas necesarias para la sesión de usuario.
            No hay cookies publicitarias ni de terceros para seguimiento en esta
            fase.
          </p>
        </section>
      </div>

      <p className="mt-8 text-xs text-text-muted">Última actualización: 20 de octubre de 2026.</p>
    </main>
  );
}
