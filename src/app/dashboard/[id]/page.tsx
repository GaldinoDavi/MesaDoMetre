import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { deleteNpc, deleteSessao } from "@/app/dashboard/[id]/actions";

const STATUS_LABEL: Record<string, string> = {
  vivo: "Vivo",
  morto: "Morto",
  desaparecido: "Desaparecido",
  aliado: "Aliado",
  inimigo: "Inimigo",
};

export default async function CampanhaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: campanha } = await supabase
    .from("campanha")
    .select("id, nome, sistema, sinopse")
    .eq("id", id)
    .single();

  if (!campanha) {
    notFound();
  }

  const [{ data: npcs }, { data: sessoes }] = await Promise.all([
    supabase
      .from("npc")
      .select("id, nome, status")
      .eq("campanha_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("sessao")
      .select("id, data, resumo")
      .eq("campanha_id", id)
      .order("data", { ascending: false }),
  ]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 p-6">
      <div>
        <Link
          href="/dashboard"
          className="text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          ← Suas campanhas
        </Link>
        <h1 className="mt-2 text-2xl font-bold">{campanha.nome}</h1>
        {campanha.sistema && (
          <p className="text-sm text-muted-foreground">{campanha.sistema}</p>
        )}
        {campanha.sinopse && <p className="mt-2 text-sm">{campanha.sinopse}</p>}
      </div>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">NPCs</h2>
          <Button render={<Link href={`/dashboard/${id}/npcs/novo`} />}>
            Novo NPC
          </Button>
        </div>
        {!npcs?.length ? (
          <p className="text-muted-foreground">Nenhum NPC ainda.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {npcs.map((npc) => (
              <li
                key={npc.id}
                className="flex items-center justify-between rounded-md border p-4"
              >
                <div>
                  <p className="font-medium">{npc.nome}</p>
                  <p className="text-sm text-muted-foreground">
                    {STATUS_LABEL[npc.status]}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    render={
                      <Link href={`/dashboard/${id}/npcs/${npc.id}/editar`} />
                    }
                  >
                    Editar
                  </Button>
                  <ConfirmDeleteButton
                    itemLabel={npc.nome}
                    action={deleteNpc.bind(null, npc.id, id)}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Sessões</h2>
          <Button render={<Link href={`/dashboard/${id}/sessoes/novo`} />}>
            Nova sessão
          </Button>
        </div>
        {!sessoes?.length ? (
          <p className="text-muted-foreground">Nenhuma sessão ainda.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {sessoes.map((sessao) => (
              <li
                key={sessao.id}
                className="flex items-center justify-between rounded-md border p-4"
              >
                <div>
                  <p className="font-medium">
                    {new Date(sessao.data).toLocaleDateString("pt-BR")}
                  </p>
                  {sessao.resumo && (
                    <p className="text-sm text-muted-foreground">
                      {sessao.resumo}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    render={
                      <Link
                        href={`/dashboard/${id}/sessoes/${sessao.id}/editar`}
                      />
                    }
                  >
                    Editar
                  </Button>
                  <ConfirmDeleteButton
                    itemLabel={new Date(sessao.data).toLocaleDateString(
                      "pt-BR",
                    )}
                    action={deleteSessao.bind(null, sessao.id, id)}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
