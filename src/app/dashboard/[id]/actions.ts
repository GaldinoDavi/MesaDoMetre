"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type EntityActionState = { error: string } | undefined;

const NPC_STATUSES = [
  "vivo",
  "morto",
  "desaparecido",
  "aliado",
  "inimigo",
] as const;
type NpcStatus = (typeof NPC_STATUSES)[number];

export async function createNpc(
  campanhaId: string,
  _prevState: EntityActionState,
  formData: FormData,
): Promise<EntityActionState> {
  const nome = (formData.get("nome") as string)?.trim();
  if (!nome) {
    return { error: "Nome é obrigatório." };
  }

  const status = formData.get("status") as string;
  if (!NPC_STATUSES.includes(status as NpcStatus)) {
    return { error: "Status inválido." };
  }

  const descricao = (formData.get("descricao") as string)?.trim() || null;
  const motivacao = (formData.get("motivacao") as string)?.trim() || null;
  const imagem_url = (formData.get("imagem_url") as string)?.trim() || null;

  const supabase = await createClient();
  const { error } = await supabase.from("npc").insert({
    campanha_id: campanhaId,
    nome,
    descricao,
    motivacao,
    status,
    imagem_url,
  });

  if (error) {
    return { error: "Não foi possível criar o NPC." };
  }

  revalidatePath(`/dashboard/${campanhaId}`);
  redirect(`/dashboard/${campanhaId}`);
}

export async function updateNpc(
  npcId: string,
  campanhaId: string,
  _prevState: EntityActionState,
  formData: FormData,
): Promise<EntityActionState> {
  const nome = (formData.get("nome") as string)?.trim();
  if (!nome) {
    return { error: "Nome é obrigatório." };
  }

  const status = formData.get("status") as string;
  if (!NPC_STATUSES.includes(status as NpcStatus)) {
    return { error: "Status inválido." };
  }

  const descricao = (formData.get("descricao") as string)?.trim() || null;
  const motivacao = (formData.get("motivacao") as string)?.trim() || null;
  const imagem_url = (formData.get("imagem_url") as string)?.trim() || null;

  const supabase = await createClient();
  const { data: updated, error } = await supabase
    .from("npc")
    .update({ nome, descricao, motivacao, status, imagem_url })
    .eq("id", npcId)
    .select()
    .single();

  if (error || !updated) {
    return { error: "Não foi possível salvar as alterações." };
  }

  revalidatePath(`/dashboard/${campanhaId}`);
  redirect(`/dashboard/${campanhaId}`);
}

export async function deleteNpc(npcId: string, campanhaId: string) {
  const supabase = await createClient();
  const { data: deleted, error } = await supabase
    .from("npc")
    .delete()
    .eq("id", npcId)
    .select()
    .single();

  if (error || !deleted) {
    throw new Error("Não foi possível excluir o NPC.");
  }

  revalidatePath(`/dashboard/${campanhaId}`);
}

export async function createSessao(
  campanhaId: string,
  _prevState: EntityActionState,
  formData: FormData,
): Promise<EntityActionState> {
  const data = (formData.get("data") as string)?.trim();
  if (!data) {
    return { error: "Data é obrigatória." };
  }

  const resumo = (formData.get("resumo") as string)?.trim() || null;
  const notas = (formData.get("notas") as string)?.trim() || null;

  const supabase = await createClient();
  const { error } = await supabase
    .from("sessao")
    .insert({ campanha_id: campanhaId, data, resumo, notas });

  if (error) {
    return { error: "Não foi possível criar a sessão." };
  }

  revalidatePath(`/dashboard/${campanhaId}`);
  redirect(`/dashboard/${campanhaId}`);
}

export async function updateSessao(
  sessaoId: string,
  campanhaId: string,
  _prevState: EntityActionState,
  formData: FormData,
): Promise<EntityActionState> {
  const data = (formData.get("data") as string)?.trim();
  if (!data) {
    return { error: "Data é obrigatória." };
  }

  const resumo = (formData.get("resumo") as string)?.trim() || null;
  const notas = (formData.get("notas") as string)?.trim() || null;

  const supabase = await createClient();
  const { data: updated, error } = await supabase
    .from("sessao")
    .update({ data, resumo, notas })
    .eq("id", sessaoId)
    .select()
    .single();

  if (error || !updated) {
    return { error: "Não foi possível salvar as alterações." };
  }

  revalidatePath(`/dashboard/${campanhaId}`);
  redirect(`/dashboard/${campanhaId}`);
}

export async function deleteSessao(sessaoId: string, campanhaId: string) {
  const supabase = await createClient();
  const { data: deleted, error } = await supabase
    .from("sessao")
    .delete()
    .eq("id", sessaoId)
    .select()
    .single();

  if (error || !deleted) {
    throw new Error("Não foi possível excluir a sessão.");
  }

  revalidatePath(`/dashboard/${campanhaId}`);
}
