"use server";

import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";

const NpcSuggestionSchema = z.object({
  nome: z.string(),
  descricao: z.string(),
  motivacao: z.string(),
  status: z.enum(["vivo", "morto", "desaparecido", "aliado", "inimigo"]),
});

export type NpcSuggestion = z.infer<typeof NpcSuggestionSchema> & {
  imagem_url: string | null;
};

export async function generateNpc(prompt: string): Promise<NpcSuggestion> {
  if (!prompt.trim()) {
    throw new Error("Descreva o NPC que você quer gerar.");
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("Geração por IA não configurada (falta ANTHROPIC_API_KEY).");
  }

  const client = new Anthropic();

  const response = await client.messages.parse({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system:
      "Você ajuda mestres de RPG de mesa a criar NPCs (personagens não-jogáveis). " +
      "A partir de uma descrição curta, sugira um NPC coerente em português do Brasil.",
    messages: [{ role: "user", content: prompt }],
    output_config: { format: zodOutputFormat(NpcSuggestionSchema) },
  });

  if (!response.parsed_output) {
    throw new Error("Não foi possível gerar o NPC. Tente novamente.");
  }

  return { ...response.parsed_output, imagem_url: null };
}
