"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { EntityActionState } from "@/app/dashboard/[id]/actions";

type Sessao = {
  data: string;
  resumo: string | null;
  notas: string | null;
};

export function SessaoForm({
  action,
  sessao,
  submitLabel,
}: {
  action: (
    state: EntityActionState,
    formData: FormData,
  ) => Promise<EntityActionState>;
  sessao?: Sessao;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid gap-2">
        <Label htmlFor="data">Data</Label>
        <Input
          id="data"
          name="data"
          type="date"
          required
          defaultValue={sessao?.data}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="resumo">Resumo</Label>
        <Textarea
          id="resumo"
          name="resumo"
          rows={3}
          defaultValue={sessao?.resumo ?? ""}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="notas">Notas</Label>
        <Textarea
          id="notas"
          name="notas"
          rows={4}
          defaultValue={sessao?.notas ?? ""}
        />
      </div>
      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : submitLabel}
      </Button>
    </form>
  );
}
