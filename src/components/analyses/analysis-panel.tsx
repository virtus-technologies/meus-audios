"use client";

import { Sparkles, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/format";

import { createAnalysisAction, deleteAnalysisAction } from "./analysis-actions";

export type AnalysisItem = {
  id: string;
  question: string | null;
  templateId: string | null;
  result: string;
  createdAt: Date;
};

export type Template = {
  id: string;
  name: string;
  description: string;
  category: string;
};

type AnalysisPanelProps = {
  audioId: string;
  hasTranscript: boolean;
  templates: ReadonlyArray<Template>;
  initialAnalyses: ReadonlyArray<AnalysisItem>;
};

export function AnalysisPanel({
  audioId,
  hasTranscript,
  templates,
  initialAnalyses,
}: AnalysisPanelProps) {
  const [question, setQuestion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [analyses, setAnalyses] = useState<AnalysisItem[]>(initialAnalyses.slice());

  function runAnalysis(input: { question?: string; templateId?: string }) {
    setError(null);
    startTransition(async () => {
      const result = await createAnalysisAction({ audioId, ...input });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setQuestion("");
      // Refetch via reload do server pra simplicidade — Next vai revalidar
      // a página inteira por causa do revalidatePath na action.
      window.location.reload();
    });
  }

  function removeAnalysis(analysisId: string) {
    startTransition(async () => {
      const result = await deleteAnalysisAction({ audioId, analysisId });
      if (result.ok) {
        setAnalyses((prev) => prev.filter((a) => a.id !== analysisId));
      } else {
        setError(result.error);
      }
    });
  }

  if (!hasTranscript) {
    return (
      <section className="rounded-2xl border border-border bg-surface p-6">
        <h3 className="mb-2 font-display text-lg font-medium tracking-tight">Análise com IA</h3>
        <p className="text-sm text-muted-foreground">
          Transcreva o áudio primeiro para liberar perguntas livres e templates de análise.
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6">
      <div className="flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
          <Sparkles className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <h3 className="font-display text-lg font-medium tracking-tight">Análise com IA</h3>
      </div>

      <div className="flex flex-col gap-2">
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Pergunte algo sobre este áudio... ex.: quais foram as decisões e responsáveis?"
          rows={3}
          maxLength={2000}
          className="rounded-xl border border-border bg-surface p-3 text-sm outline-none focus:border-accent focus:ring-4 focus:ring-accent/20"
        />
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">Modelo: GPT — leva alguns segundos</span>
          <Button
            disabled={isPending || question.trim().length < 3}
            onClick={() => runAnalysis({ question })}
          >
            {isPending ? "Analisando..." : "Analisar"}
          </Button>
        </div>
      </div>

      {templates.length > 0 ? (
        <div className="flex flex-col gap-2">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Templates rápidos
          </h4>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {templates.slice(0, 6).map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => runAnalysis({ templateId: template.id })}
                disabled={isPending}
                className="flex items-start gap-3 rounded-xl border border-border bg-surface p-3 text-left transition hover:-translate-y-px hover:border-accent disabled:opacity-50"
              >
                <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-accent-light text-accent">
                  <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold leading-tight">{template.name}</div>
                  <div className="line-clamp-2 text-xs text-muted-foreground">
                    {template.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {error ? <p className="text-sm text-destructive-dark">{error}</p> : null}

      {analyses.length > 0 ? (
        <div className="flex flex-col gap-3 border-t border-border pt-4">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Histórico
          </h4>
          {analyses.map((analysis) => (
            <details
              key={analysis.id}
              className="rounded-xl border border-border bg-surface-muted p-3 text-sm [&[open]]:bg-surface"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="line-clamp-1 font-semibold">
                    {analysis.question ??
                      templates.find((t) => t.id === analysis.templateId)?.name ??
                      "Análise"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatRelativeTime(analysis.createdAt)}
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Excluir análise"
                  onClick={(event) => {
                    event.preventDefault();
                    removeAnalysis(analysis.id);
                  }}
                  className="rounded p-1 text-muted-foreground transition hover:bg-destructive-light hover:text-destructive-dark"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </summary>
              <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">
                {analysis.result}
              </div>
            </details>
          ))}
        </div>
      ) : null}
    </section>
  );
}
