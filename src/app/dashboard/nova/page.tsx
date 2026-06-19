import { CampanhaForm } from "@/components/campanha-form";
import { createCampanha } from "@/app/dashboard/actions";

export default function NovaCampanhaPage() {
  return (
    <div className="mx-auto max-w-sm p-6">
      <h1 className="mb-6 text-2xl font-bold">Nova campanha</h1>
      <CampanhaForm action={createCampanha} submitLabel="Criar campanha" />
    </div>
  );
}
