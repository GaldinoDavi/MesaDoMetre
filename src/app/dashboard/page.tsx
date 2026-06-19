import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { Button } from "@/components/ui/button";
import { hasEnvVars } from "@/lib/utils";
import { deleteCampanha } from "@/app/dashboard/actions";

export default async function DashboardPage() {
  if (!hasEnvVars) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/login");
  }

  const { data: campanhas } = await supabase
    .from("campanha")
    .select("id, nome, sistema, sinopse, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <header className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Logado como <strong>{data.claims.email}</strong>
        </p>
        <LogoutButton />
      </header>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Suas campanhas</h1>
        <Button render={<Link href="/dashboard/nova" />}>Nova campanha</Button>
      </div>

      {!campanhas?.length ? (
        <p className="text-muted-foreground">
          Você ainda não tem nenhuma campanha. Crie a primeira!
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {campanhas.map((campanha) => (
            <li
              key={campanha.id}
              className="flex items-center justify-between rounded-md border p-4"
            >
              <div>
                <Link
                  href={`/dashboard/${campanha.id}`}
                  className="font-medium underline-offset-4 hover:underline"
                >
                  {campanha.nome}
                </Link>
                {campanha.sistema && (
                  <p className="text-sm text-muted-foreground">
                    {campanha.sistema}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  render={<Link href={`/dashboard/${campanha.id}/editar`} />}
                >
                  Editar
                </Button>
                <ConfirmDeleteButton
                  itemLabel={campanha.nome}
                  action={deleteCampanha.bind(null, campanha.id)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
