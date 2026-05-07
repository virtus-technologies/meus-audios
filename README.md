# MeusÁudios

Aplicação SaaS para upload, organização, transcrição e análise inteligente de áudios.

> **Estado atual:** scaffold inicial (ticket [VIR-5](https://linear.app/virtus-technologies/issue/VIR-5) — `[#01] Setup Next.js + TS + Tailwind + shadcn`). Funcionalidades completas chegam nos próximos tickets, na ordem indicada por `[#NN]` no título.

## Stack

- **Next.js** 15 (App Router) + React 19 + TypeScript
- **Tailwind CSS** 3 com tokens da paleta laranja definidos em `src/app/globals.css`
- **shadcn/ui** (`new-york` style) configurado via `components.json`
- **lucide-react** para ícones
- ESLint + Prettier (com `prettier-plugin-tailwindcss`)

A paleta e a tipografia (Plus Jakarta Sans + Fraunces + JetBrains Mono) seguem `docs/design.md`.

## Documentos de referência

| Documento | Conteúdo |
| --- | --- |
| `docs/plano-de-negocios.md` | Visão de produto, MVP, regras de negócio, telas, microcopy. |
| `docs/plano-de-implementacao.md` | Stack, schema Prisma, rotas, serviços de domínio, validações. |
| `docs/design.md` | Paleta, tipografia, componentes, layouts, empty states. |
| `preview/index.html` | Preview HTML estático com 4 telas (Landing, Dashboard, Biblioteca, Áudio). |

## Setup local

```bash
# 1. Instalar dependências
npm install

# 2. Copiar variáveis de ambiente (preencher conforme tickets futuros)
cp .env.example .env.local

# 3. Rodar dev server
npm run dev

# Outras tasks
npm run lint        # ESLint
npm run typecheck   # TS sem emit
npm run format      # Prettier write
npm run build       # Build de produção
```

A aplicação sobe em `http://localhost:3000`.

## Estrutura de pastas

Conforme `docs/plano-de-implementacao.md` seção 4:

```
src/
  app/            # Rotas (App Router)
  components/     # Componentes React reutilizáveis
    ui/           # Primitivos shadcn/ui
  lib/
    utils.ts      # cn() helper para class merging
    db/           # Cliente Prisma (#02)
    auth/         # Helpers de sessão (#04)
    storage/      # Vercel Blob (#03)
    ai/           # OpenAI / AI SDK (#28+)
    validations/  # Schemas Zod (#10)
  services/       # Lógica de domínio (#11+)
  types/
  constants/
  prompts/
prisma/           # Schema (#02)
preview/          # Preview HTML estático (referência visual)
docs/             # Specs do produto
```

## Tickets

Backlog completo em [Linear · projeto meus-audios](https://linear.app/virtus-technologies/project/meus-audios-77834a2a7d8c). Ordem de implementação codificada no prefixo `[#NN]` do título — sort alfabético respeita dependências.
