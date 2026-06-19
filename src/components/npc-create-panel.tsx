"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NpcForm } from "@/components/npc-form";
import { createNpc } from "@/app/dashboard/[id]/actions";
import {
  generateNpc,
  type NpcSuggestion,
} from "@/app/dashboard/[id]/npc-ai-actions";

export function NpcCreatePanel({ campanhaId }: { campanhaId: string }) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<NpcSuggestion | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const suggestion = await generateNpc(prompt);
      setDraft(suggestion);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Não foi possível gerar.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 rounded-md border p-4">
        <Label htmlFor="ai-prompt">Gerar com IA</Label>
        <div className="flex gap-2">
          <Input
            id="ai-prompt"
            placeholder="taverneiro suspeito, cidade portuária"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating ? "Gerando..." : "Gerar"}
          </Button>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <NpcForm
        key={draft ? JSON.stringify(draft) : "empty"}
        action={createNpc.bind(null, campanhaId)}
        npc={draft ?? undefined}
        submitLabel="Criar NPC"
      />
    </div>
  );
}
