import { SessaoForm } from "@/components/sessao-form";
import { createSessao } from "@/app/dashboard/[id]/actions";

export default async function NovaSessaoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-sm p-6">
      <h1 className="mb-6 text-2xl font-bold">Nova sessão</h1>
      <SessaoForm
        action={createSessao.bind(null, id)}
        submitLabel="Criar sessão"
      />
    </div>
  );
}
