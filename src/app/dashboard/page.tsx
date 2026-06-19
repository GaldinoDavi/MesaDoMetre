import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button";
import { hasEnvVars } from "@/lib/utils";

export default async function DashboardPage() {
  if (!hasEnvVars) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 text-center">
        <p>
          Logado como <strong>{data.claims.email}</strong>
        </p>
        <LogoutButton />
      </div>
    </div>
  );
}
