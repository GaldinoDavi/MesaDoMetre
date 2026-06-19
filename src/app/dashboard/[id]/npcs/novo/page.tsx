import { NpcCreatePanel } from "@/components/npc-create-panel";

export default async function NovoNpcPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-sm p-6">
      <h1 className="mb-6 text-2xl font-bold">Novo NPC</h1>
      <NpcCreatePanel campanhaId={id} />
    </div>
  );
}
