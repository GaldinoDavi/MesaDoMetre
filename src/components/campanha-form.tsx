"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CampanhaActionState } from "@/app/dashboard/actions";

type Campanha = {
  nome: string;
  sistema: string | null;
  sinopse: string | null;
};

export function CampanhaForm({
  action,
  campanha,
  submitLabel,
}: {
  action: (
    state: CampanhaActionState,
    formData: FormData,
  ) => Promise<CampanhaActionState>;
  campanha?: Campanha;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid gap-2">
        <Label htmlFor="nome">Nome</Label>
        <Input id="nome" name="nome" required defaultValue={campanha?.nome} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="sistema">Sistema</Label>
        <Input
          id="sistema"
          name="sistema"
          placeholder="D&D 5e, Tormenta20..."
          defaultValue={campanha?.sistema ?? ""}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="sinopse">Sinopse</Label>
        <Textarea
          id="sinopse"
          name="sinopse"
          rows={4}
          defaultValue={campanha?.sinopse ?? ""}
        />
      </div>
      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : submitLabel}
      </Button>
    </form>
  );
}
