# MeusÁudios

SaaS para upload, organização, transcrição e análise inteligente de áudios.

> **Estado atual (2026-05-08):** MVP completo. 58/59 tickets entregues, 1 cancelado (low priority). Resumo em `docs/plano-de-negocios.md` seção 0.

## Funcionalidades

- Cadastro/login com email + senha (bcrypt) e Google OAuth (conditional)
- Middleware de proteção de rotas + isolamento por `userId`
- Upload de áudio para Vercel Blob (mp3, m4a, wav, ogg, webm, mp4 — até 2 GB)
- Pastas com árvore lógica, mover, renomear, excluir (cascade de paths)
- Transcrição automática via OpenAI Whisper com timestamps por segmento
- Editor manual de transcrição
- Análise com IA (gpt-4o-mini) — perguntas livres ou 11 templates do sistema
- Notas por timestamp clicáveis (seek do player)
- Tags
- Busca global ⌘K em áudios, pastas, tags, transcrições e análises
- Dashboard com métricas + recentes
- Configurações com edição de perfil + zona de perigo (excluir conta)
- Landing pública

## Stack

- **Next.js** 15 (App Router) + React 19 + TypeScript estrito
- **Tailwind CSS** 3 com paleta laranja em CSS vars (`src/app/globals.css`)
- **shadcn/ui** (`new-york` style, `components.json`)
- **lucide-react** ícones
- **Prisma 6** + Postgres
- **NextAuth v5** + Prisma adapter + Credentials + Google
- **Vercel Blob** com path-traversal protection
- **OpenAI** Whisper (transcrição) + Chat Completions (análises)
- **Zod** validation
- ESLint + Prettier (`prettier-plugin-tailwindcss`)
- GitHub Actions CI

Tipografia: Plus Jakarta Sans (body) + Fraunces (display) + JetBrains Mono (timestamps).

## Documentos de referência

| Documento | Conteúdo |
| --- | --- |
| `docs/plano-de-negocios.md` | Visão de produto, MVP, regras de negócio, telas, microcopy. |
| `docs/plano-de-implementacao.md` | Stack, schema Prisma, rotas, serviços de domínio, validações. |
| `docs/design.md` | Paleta, tipografia, componentes, layouts, empty states. |
| `preview/index.html` | Preview HTML estático com 4 telas (Landing, Dashboard, Biblioteca, Áudio). |

## Setup local

```bash
# 1. Instalar dependências (gera o cliente Prisma via postinstall)
npm install

# 2. Copiar variáveis de ambiente (preencher conforme tickets futuros)
cp .env.example .env.local

# 3. Subir Postgres local via Docker (recomendado para dev)
npm run db:up

# 4. Aplicar migrations no banco local
npm run db:migrate -- --name init

# 5. Seed dos 11 templates de análise IA
npm run db:seed

# 6. Rodar dev server
npm run dev
```

### Postgres local com Docker

A pilha de dev usa Postgres 16 Alpine via `docker-compose.yml`. O `.env.example` já vem com a `DATABASE_URL` apontando para o container, basta copiar.

```bash
npm run db:up      # sobe o container (porta 5432, volume nomeado)
npm run db:logs    # tail dos logs
npm run db:down    # derruba o container (dados persistem no volume)
```

Credenciais padrão (apenas dev): user `meus_audios`, senha `meus_audios_dev`, db `meus_audios`. Para produção provisionar via Vercel Marketplace (Neon) ou outro provider e sobrescrever `DATABASE_URL` em `.env.production` / variáveis Vercel.

### Tasks disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Dev server em `http://localhost:3000` |
| `npm run build` | Build de produção |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript sem emit |
| `npm run format` | Prettier write |
| `npm run db:up` | Sobe Postgres local via Docker |
| `npm run db:down` | Derruba container (volume preserva dados) |
| `npm run db:logs` | Tail dos logs do container |
| `npm run db:generate` | Regenerar cliente Prisma |
| `npm run db:migrate` | Criar e aplicar migration em dev |
| `npm run db:migrate:deploy` | Aplicar migrations em produção |
| `npm run db:studio` | Abrir Prisma Studio (UI do banco) |
| `npm run db:reset` | Resetar banco e re-aplicar migrations (destrutivo) |
| `npm run db:seed` | Seed dos 11 templates de análise (idempotente) |

## Estrutura de pastas

Detalhe completo em `docs/plano-de-implementacao.md` seção 0. Resumo:

```
src/
  app/
    (auth)/                    # rotas públicas: login, register, forgot-password
    (dashboard)/               # rotas autenticadas (layout chama requireUser)
    api/                       # route handlers REST
    page.tsx                   # landing
  components/
    analyses/                  # AnalysisPanel + actions
    audios/                    # Card, Player, Status, Metadata, Notes, Transcript
    folders/                   # Tree + Dialogs
    layout/                    # AppShell, Sidebar, Topbar, Brand, Breadcrumb
    search/                    # CommandPalette ⌘K
    tags/                      # TagBadge
    ui/                        # primitives shadcn-style
    upload/                    # Provider + Dialog + Dropzone
  lib/
    auth.ts                    # requireUser/requireUserApi/requireOwnership
    db.ts                      # Prisma singleton
    api-error.ts               # apiError helper
    storage/                   # Vercel Blob (server-only)
    ai/                        # OpenAI client + prompts
    validations/               # Zod schemas
    format.ts                  # formatDuration etc
    logger.ts                  # withTimedLog
    passwords.ts               # bcrypt hash/verify
    utils.ts                   # cn()
  services/                    # lógica de domínio (server-only)
  middleware.ts                # Edge — usa src/auth.config.ts
  auth.config.ts               # config Edge-safe
  auth.ts                      # config Node + Prisma adapter
  types/next-auth.d.ts
prisma/
  schema.prisma
  seed-templates.ts
docker-compose.yml
.github/workflows/ci.yml
preview/index.html             # referência visual estática
docs/                          # plano-de-negocios, plano-de-implementacao, design
```

## Deploy (Vercel)

O repositório já está linkado ao projeto Vercel `meus-audios` (vide `.vercel/project.json`). Pushes em `main` disparam deploy de produção; PRs ganham preview deployment automaticamente.

### Variáveis de ambiente em produção

Configurar via **Vercel Dashboard** → projeto → **Settings → Environment Variables**:

| Variável | Origem | Tickets |
| --- | --- | --- |
| `DATABASE_URL` | Neon/Postgres marketplace | #02 |
| `BLOB_READ_WRITE_TOKEN` | Vercel Storage → Blob | #03 |
| `AUTH_SECRET` | `openssl rand -base64 32` | #04 |
| `AUTH_URL` | auto-detectado na Vercel | #04 |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google Cloud Console → OAuth client | #09 |
| `OPENAI_API_KEY` | OpenAI dashboard | #28+ |

Sincronizar também em Preview e Development com valores não-prod onde aplicável. Para puxar localmente: `vercel env pull .env.local`.

### CI

`.github/workflows/ci.yml` roda em cada PR e push para `main`:

- `npm ci`
- `prisma generate`
- `npm run typecheck`
- `npm run lint`
- `npm run format:check`
- `npm run build`

Variáveis de ambiente de placeholder são suficientes para os checks.

## Tickets

Backlog completo em [Linear · projeto meus-audios](https://linear.app/virtus-technologies/project/meus-audios-77834a2a7d8c). Ordem de implementação codificada no prefixo `[#NN]` do título — sort alfabético respeita dependências.
