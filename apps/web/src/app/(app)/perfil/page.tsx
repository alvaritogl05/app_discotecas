import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ProfileForm, type ProfileRow } from "@/components/app/ProfileForm";

export const metadata: Metadata = { title: "Perfil" };

export default async function ProfilePage() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) redirect("/login?reason=not-configured");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: preferences }] = await Promise.all([
    supabase.rpc("get_my_profile").maybeSingle(),
    supabase.from("user_preferences").select("*").eq("user_id", user.id).maybeSingle(),
  ]);

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <h1 className="mb-1 text-2xl font-bold">Mi perfil</h1>
      <p className="mb-6 text-sm text-text-secondary">
        Lo que verán los demás. Tu fecha de nacimiento nunca es pública.
      </p>
      <ProfileForm
        initialProfile={profile as ProfileRow | null}
        initialPreferences={preferences as never}
      />
    </div>
  );
}
