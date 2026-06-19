import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { hasEnvVars } from "@/lib/utils";

export default async function HomePage() {
  let isLoggedIn = false;

  if (hasEnvVars) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    isLoggedIn = !!data?.claims;
  }

  return (
    <div className="flex min-h-svh flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold">Mesa do Mestre</h1>
        <p className="max-w-md text-muted-foreground">
          Organize campanhas, NPCs e sessões de RPG de mesa num lugar só, e
          gere NPCs com ajuda de IA quando precisar de inspiração rápida.
        </p>
      </div>
      <Button render={<Link href={isLoggedIn ? "/dashboard" : "/login"} />}>
        {isLoggedIn ? "Ir para minhas campanhas" : "Entrar"}
      </Button>
    </div>
  );
}
