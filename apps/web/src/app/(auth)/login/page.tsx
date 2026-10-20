"use client";

import { Suspense, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { requestSmsCode, signInWithOAuth, verifySmsCode } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Form";
import { Card } from "@/components/ui/Layout";
import { AppleIcon, GoogleIcon, PhoneIcon } from "@/components/auth/AuthIcons";

type Step = "providers" | "sms-phone" | "sms-code";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [step, setStep] = useState<Step>("providers");
  const [phone, setPhone] = useState("+34");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const configured = params.get("reason") !== "not-configured";

  function handleOAuth(provider: "google" | "apple") {
    setError(null);
    startTransition(async () => {
      const result = await signInWithOAuth(provider);
      if (result.ok) {
        window.location.href = result.data.url;
      } else {
        setError(result.error);
      }
    });
  }

  function handleRequestCode() {
    setError(null);
    startTransition(async () => {
      const result = await requestSmsCode(phone);
      if (result.ok) {
        setStep("sms-code");
        setNotice("Te hemos enviado un código por SMS.");
      } else {
        setError(result.error);
      }
    });
  }

  function handleVerifyCode() {
    setError(null);
    startTransition(async () => {
      const result = await verifySmsCode(phone, code);
      if (result.ok) {
        router.push("/perfil?nuevo=1");
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  if (!configured) {
    return (
      <Card className="animate-fade-in">
        <h1 className="mb-2 text-lg font-bold">Configuración pendiente</h1>
        <p className="mb-4 text-sm text-text-secondary">
          La aplicación necesita conectar con Supabase para autenticar usuarios.
          Nadie puede registrarse todavía.
        </p>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-text-secondary">
          <li>Crea un proyecto en supabase.com.</li>
          <li>
            Copia <code className="text-neon-violet">.env.example</code> como{" "}
            <code className="text-neon-violet">apps/web/.env.local</code> y rellena
            la URL del proyecto y la clave <em>anon</em>.
          </li>
          <li>Aplica las migraciones de <code className="text-neon-violet">supabase/migrations</code>.</li>
          <li>
            Habilita los proveedores de acceso en Authentication → Providers del
            panel de Supabase (Google, Apple y/o Phone).
          </li>
          <li>Reinicia el servidor de desarrollo.</li>
        </ol>
        <p className="mt-4 text-xs text-text-muted">
          El detalle completo está en el README del proyecto.
        </p>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <h1 className="mb-1 text-xl font-bold">Entra en App Discotecas</h1>
      <p className="mb-6 text-sm text-text-secondary">
        Tu noche. Tu gente. Solo mayores de 18 años.
      </p>

      {step === "providers" && (
        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="btn-secondary w-full"
            onClick={() => handleOAuth("google")}
            disabled={pending}
          >
            <GoogleIcon className="size-5" />
            Continuar con Google
          </button>
          <button
            type="button"
            className="btn-secondary w-full"
            onClick={() => handleOAuth("apple")}
            disabled={pending}
          >
            <AppleIcon className="size-5" />
            Continuar con Apple
          </button>
          <button
            type="button"
            className="btn-secondary w-full"
            onClick={() => setStep("sms-phone")}
            disabled={pending}
          >
            <PhoneIcon className="size-5" />
            Continuar con mi teléfono
          </button>
        </div>
      )}

      {step === "sms-phone" && (
        <div>
          <Input
            label="Teléfono móvil"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+34612345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            hint="Formato internacional, p. ej. +34612345678."
          />
          <div className="flex gap-2">
            <Button onClick={handleRequestCode} disabled={pending} className="w-full">
              Enviarme el código
            </Button>
          </div>
          <button
            type="button"
            className="btn-ghost mt-3 w-full"
            onClick={() => setStep("providers")}
          >
            Volver
          </button>
        </div>
      )}

      {step === "sms-code" && (
        <div>
          <Input
            label="Código de 6 dígitos"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button onClick={handleVerifyCode} disabled={pending || code.length !== 6} className="w-full">
            Verificar y entrar
          </Button>
          <button
            type="button"
            className="btn-ghost mt-3 w-full"
            onClick={() => setStep("sms-phone")}
          >
            Cambiar de teléfono
          </button>
        </div>
      )}

      {notice && <p className="mt-4 text-sm text-success" role="status">{notice}</p>}
      {error && (
        <p role="alert" className="mt-4 text-sm text-danger">
          {error}
        </p>
      )}
    </Card>
  );
}

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-10">
      <Suspense fallback={<div className="surface h-72 animate-pulse-soft" />}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
