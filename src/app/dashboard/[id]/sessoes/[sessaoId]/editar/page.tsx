import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { SessaoForm } from "@/components/sessao-form";
import { updateSessao } from "@/app/dashboard/[id]/actions";

export default async function EditarSessaoPage({
  params,
}: {
  params: Promise<{ id: string; sessaoId: string }>;
}) {
  const { id, sessaoId } = await params;
  const supabase = await createClient();
  const { data: sessao } = await supabase
    .from("sessao")
    .select("data, resumo, notas")
    .eq("id", sessaoId)
    .eq("campanha_id", id)
    .single();

  if (!sessao) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-sm p-6">
      <h1 className="mb-6 text-2xl font-bold">Editar sessão</h1>
      <SessaoForm
        action={updateSessao.bind(null, sessaoId, id)}
        sessao={sessao}
        submitLabel="Salvar alterações"
      />
    </div>
  );
}
