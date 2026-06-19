"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EntityActionState } from "@/app/dashboard/[id]/actions";

const STATUS_OPTIONS = [
  { value: "vivo", label: "Vivo" },
  { value: "morto", label: "Morto" },
  { value: "desaparecido", label: "Desaparecido" },
  { value: "aliado", label: "Aliado" },
  { value: "inimigo", label: "Inimigo" },
];

type Npc = {
  nome: string;
  descricao: string | null;
  motivacao: string | null;
  status: string;
  imagem_url: string | null;
};

export function NpcForm({
  action,
  npc,
  submitLabel,
}: {
  action: (
    state: EntityActionState,
    formData: FormData,
  ) => Promise<EntityActionState>;
  npc?: Npc;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid gap-2">
        <Label htmlFor="nome">Nome</Label>
        <Input id="nome" name="nome" required defaultValue={npc?.nome} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="status">Status</Label>
        <Select name="status" defaultValue={npc?.status ?? "vivo"}>
          <SelectTrigger id="status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          name="descricao"
          rows={3}
          defaultValue={npc?.descricao ?? ""}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="motivacao">Motivação</Label>
        <Textarea
          id="motivacao"
          name="motivacao"
          rows={2}
          defaultValue={npc?.motivacao ?? ""}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="imagem_url">Imagem (link)</Label>
        <Input
          id="imagem_url"
          name="imagem_url"
          type="url"
          placeholder="https://..."
          defaultValue={npc?.imagem_url ?? ""}
        />
      </div>
      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : submitLabel}
      </Button>
    </form>
  );
}
