import { Sparkles } from "lucide-react";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function TemplatesPage() {
  const user = await requireUser();
  const templates = await prisma.analysisTemplate.findMany({
    where: { OR: [{ isSystem: true }, { userId: user.id }] },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  const byCategory = new Map<string, typeof templates>();
  for (const template of templates) {
    const list = byCategory.get(template.category) ?? [];
    list.push(template);
    byCategory.set(template.category, list);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-4xl font-medium tracking-tight">Templates</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {templates.length} templates disponíveis. Use em qualquer áudio com transcrição pronta.
        </p>
      </div>

      {Array.from(byCategory.entries()).map(([category, list]) => (
        <section key={category} className="flex flex-col gap-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            {category}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {list.map((template) => (
              <article
                key={template.id}
                className="rounded-2xl border border-border bg-surface p-5 transition hover:-translate-y-0.5 hover:border-accent hover:shadow"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent-light text-accent">
                  <Sparkles className="h-4 w-4" />
                </span>
                <h3 className="mt-3 font-display text-lg font-medium tracking-tight">
                  {template.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{template.description}</p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent-light px-2.5 py-0.5 text-xs font-semibold text-accent-dark">
                  {template.isSystem ? "Sistema" : "Pessoal"}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
