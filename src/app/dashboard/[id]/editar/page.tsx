import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { CampanhaForm } from "@/components/campanha-form";
import { updateCampanha } from "@/app/dashboard/actions";

export default async function EditarCampanhaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: campanha } = await supabase
    .from("campanha")
    .select("nome, sistema, sinopse")
    .eq("id", id)
    .single();

  if (!campanha) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-sm p-6">
      <h1 className="mb-6 text-2xl font-bold">Editar campanha</h1>
      <CampanhaForm
        action={updateCampanha.bind(null, id)}
        campanha={campanha}
        submitLabel="Salvar alterações"
      />
    </div>
  );
}
