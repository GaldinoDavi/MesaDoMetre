import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { NpcForm } from "@/components/npc-form";
import { updateNpc } from "@/app/dashboard/[id]/actions";

export default async function EditarNpcPage({
  params,
}: {
  params: Promise<{ id: string; npcId: string }>;
}) {
  const { id, npcId } = await params;
  const supabase = await createClient();
  const { data: npc } = await supabase
    .from("npc")
    .select("nome, descricao, motivacao, status, imagem_url")
    .eq("id", npcId)
    .eq("campanha_id", id)
    .single();

  if (!npc) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-sm p-6">
      <h1 className="mb-6 text-2xl font-bold">Editar NPC</h1>
      <NpcForm
        action={updateNpc.bind(null, npcId, id)}
        npc={npc}
        submitLabel="Salvar alterações"
      />
    </div>
  );
}
