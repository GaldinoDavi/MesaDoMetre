"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type CampanhaActionState = { error: string } | undefined;

async function getUserId() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  return data?.claims?.sub as string | undefined;
}

export async function createCampanha(
  _prevState: CampanhaActionState,
  formData: FormData,
): Promise<CampanhaActionState> {
  const nome = (formData.get("nome") as string)?.trim();
  if (!nome) {
    return { error: "Nome é obrigatório." };
  }

  const userId = await getUserId();
  if (!userId) {
    return { error: "Sessão inválida. Faça login novamente." };
  }

  const sistema = (formData.get("sistema") as string)?.trim() || null;
  const sinopse = (formData.get("sinopse") as string)?.trim() || null;

  const supabase = await createClient();
  const { error } = await supabase
    .from("campanha")
    .insert({ user_id: userId, nome, sistema, sinopse });

  if (error) {
    return { error: "Não foi possível criar a campanha." };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateCampanha(
  id: string,
  _prevState: CampanhaActionState,
  formData: FormData,
): Promise<CampanhaActionState> {
  const nome = (formData.get("nome") as string)?.trim();
  if (!nome) {
    return { error: "Nome é obrigatório." };
  }

  const userId = await getUserId();
  if (!userId) {
    return { error: "Sessão inválida. Faça login novamente." };
  }

  const sistema = (formData.get("sistema") as string)?.trim() || null;
  const sinopse = (formData.get("sinopse") as string)?.trim() || null;

  const supabase = await createClient();
  const { data: updated, error } = await supabase
    .from("campanha")
    .update({ nome, sistema, sinopse })
    .eq("id", id)
    .select()
    .single();

  if (error || !updated) {
    return { error: "Não foi possível salvar as alterações." };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function deleteCampanha(id: string) {
  const userId = await getUserId();
  if (!userId) {
    throw new Error("Sessão inválida. Faça login novamente.");
  }

  const supabase = await createClient();
  const { data: deleted, error } = await supabase
    .from("campanha")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error || !deleted) {
    throw new Error("Não foi possível excluir a campanha.");
  }

  revalidatePath("/dashboard");
}
