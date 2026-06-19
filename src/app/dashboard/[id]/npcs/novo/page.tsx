import { NpcForm } from "@/components/npc-form";
import { createNpc } from "@/app/dashboard/[id]/actions";

export default async function NovoNpcPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-sm p-6">
      <h1 className="mb-6 text-2xl font-bold">Novo NPC</h1>
      <NpcForm action={createNpc.bind(null, id)} submitLabel="Criar NPC" />
    </div>
  );
}
