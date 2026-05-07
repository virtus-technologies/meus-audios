# MeusÁudios — Plano de Implementação e Decisões Técnicas

## 1. Objetivo Técnico

Construir uma aplicação web SaaS chamada MeusÁudios usando Next.js, React, TypeScript e Vercel. A aplicação deve permitir upload de arquivos de áudio, organização lógica em pastas, transcrição com IA, busca textual e análise inteligente do conteúdo transcrito.

Este documento serve como guia técnico para implementação do projeto com ferramentas de vibe coding como Claude, Cursor, GitHub Copilot, v0 ou similares.

## 2. Stack Recomendada

### Frontend

- Next.js com App Router.
- React.
- TypeScript.
- Tailwind CSS.
- shadcn/ui.
- lucide-react para ícones.
- TanStack Query opcional, caso a aplicação precise de cache e gerenciamento de estado assíncrono mais avançado.

### Backend

- Next.js Route Handlers.
- Server Actions quando fizer sentido.
- API routes protegidas por autenticação.
- Validação com Zod.
- Serviços organizados por domínio.

### Banco de Dados

Recomendação principal:

- Postgres.
- Prisma ORM.
- Campos JSONB para estruturas flexíveis, como segmentos da transcrição, metadados do arquivo e resultados estruturados das análises.

Alternativa:

- MongoDB, caso a prioridade seja usar documentos flexíveis desde o início.

Decisão recomendada:

Usar Postgres com Prisma, porque o produto tem entidades relacionais claras: usuários, pastas, áudios, transcrições, análises, tags e templates.

### Storage de Arquivos

Usar Vercel Blob para armazenar os arquivos de áudio.

A estrutura física no storage não precisa refletir a estrutura de pastas do usuário. O armazenamento deve usar uma chave técnica e estável.

Exemplo:

```txt
users/{userId}/audios/{audioId}/original.{extension}
```

### IA

- OpenAI para transcrição de áudio.
- OpenAI ou Vercel AI SDK para análise textual da transcrição.
- Vercel AI SDK pode ser usado para padronizar chamadas aos modelos e facilitar evolução futura.

### Deploy

- GitHub como repositório.
- Integração direta GitHub -> Vercel.
- Deploy automático em cada push.
- Preview deployments para pull requests.
- Domínio final: meusaudios.com.br.

## 3. Arquitetura de Alto Nível

```txt
Browser
  ↓
Next.js App Router
  ↓
Protected Routes/Auth Middleware
  ↓
Route Handlers / Server Actions
  ↓
Domain Services
  ↓
Database via Prisma
  ↓
Vercel Blob for audio files
  ↓
OpenAI/Vercel AI SDK for transcription and analysis
```

Fluxo principal:

```txt
User uploads audio
  ↓
Audio file stored in Vercel Blob
  ↓
Audio metadata saved in Postgres
  ↓
User requests transcription
  ↓
Audio is sent to transcription API
  ↓
Transcript is saved in database
  ↓
User asks questions or runs templates
  ↓
AI analysis result is saved
  ↓
User reads, copies, searches or exports the result
```

## 4. Estrutura de Pastas do Projeto

Sugestão:

```txt
src/
  app/
    (auth)/
      login/
      register/
    (dashboard)/
      dashboard/
      audios/
        [audioId]/
      folders/
        [folderId]/
      templates/
      settings/
      usage/
    api/
      audios/
      folders/
      upload/
      transcription/
      analysis/
      tags/
      search/
  components/
    audio/
    folders/
    layout/
    templates/
    upload/
    ui/
  lib/
    auth/
    db/
    storage/
    ai/
    validations/
    utils/
  services/
    audio-service.ts
    folder-service.ts
    transcription-service.ts
    analysis-service.ts
    tag-service.ts
    search-service.ts
  types/
  constants/
  prompts/
prisma/
  schema.prisma
```

## 5. Principais Entidades

### User

Pode vir da solução de autenticação escolhida. Caso seja controlado localmente:

```ts
User {
  id: string
  name: string
  email: string
  image?: string
  createdAt: Date
  updatedAt: Date
}
```

### Folder

```ts
Folder {
  id: string
  userId: string
  name: string
  parentId?: string | null
  path: string
  createdAt: Date
  updatedAt: Date
}
```

Decisão:

- Manter as pastas como registros relacionais.
- Usar `parentId` para representar hierarquia.
- Gerar a árvore na leitura.
- Manter `path` para facilitar breadcrumb e busca.

### Audio

```ts
Audio {
  id: string
  userId: string
  folderId?: string | null
  title: string
  description?: string | null
  originalFileName: string
  mimeType: string
  sizeBytes: number
  durationSeconds?: number | null
  blobUrl: string
  storageKey: string
  status: AudioStatus
  language?: string | null
  contentType?: string | null
  createdAt: Date
  updatedAt: Date
}
```

### AudioStatus

```ts
enum AudioStatus {
  UPLOADED
  TRANSCRIPTION_PENDING
  TRANSCRIBING
  TRANSCRIBED
  TRANSCRIPTION_FAILED
  ANALYSIS_PENDING
  ANALYZING
  ANALYZED
  ANALYSIS_FAILED
}
```

### Transcript

```ts
Transcript {
  id: string
  audioId: string
  userId: string
  language: string
  fullText: string
  segmentsJson?: Json | null
  createdAt: Date
  updatedAt: Date
}
```

### AnalysisTemplate

```ts
AnalysisTemplate {
  id: string
  name: string
  description: string
  category: string
  prompt: string
  isSystem: boolean
  userId?: string | null
  createdAt: Date
  updatedAt: Date
}
```

Templates com `isSystem = true` são templates padrão do produto. Templates com `userId` são templates personalizados futuros.

### AudioAnalysis

```ts
AudioAnalysis {
  id: string
  audioId: string
  userId: string
  templateId?: string | null
  question?: string | null
  result: string
  resultJson?: Json | null
  createdAt: Date
  updatedAt: Date
}
```

### Tag

```ts
Tag {
  id: string
  userId: string
  name: string
  createdAt: Date
  updatedAt: Date
}
```

### AudioTag

```ts
AudioTag {
  audioId: string
  tagId: string
}
```

### AudioNote

```ts
AudioNote {
  id: string
  audioId: string
  userId: string
  timestampSeconds: number
  text: string
  createdAt: Date
  updatedAt: Date
}
```

## 6. Prisma Schema Base

```prisma
model Folder {
  id        String   @id @default(cuid())
  userId    String
  name      String
  parentId  String?
  path      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  parent    Folder?  @relation("FolderTree", fields: [parentId], references: [id])
  children  Folder[] @relation("FolderTree")
  audios    Audio[]

  @@index([userId])
  @@index([parentId])
}

model Audio {
  id               String      @id @default(cuid())
  userId           String
  folderId         String?
  title            String
  description      String?
  originalFileName String
  mimeType         String
  sizeBytes        Int
  durationSeconds  Int?
  blobUrl          String
  storageKey       String
  status           AudioStatus @default(UPLOADED)
  language         String?
  contentType      String?
  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @updatedAt

  folder           Folder?     @relation(fields: [folderId], references: [id])
  transcript       Transcript?
  analyses         AudioAnalysis[]
  notes            AudioNote[]
  tags             AudioTag[]

  @@index([userId])
  @@index([folderId])
  @@index([status])
}

enum AudioStatus {
  UPLOADED
  TRANSCRIPTION_PENDING
  TRANSCRIBING
  TRANSCRIBED
  TRANSCRIPTION_FAILED
  ANALYSIS_PENDING
  ANALYZING
  ANALYZED
  ANALYSIS_FAILED
}

model Transcript {
  id           String   @id @default(cuid())
  audioId      String   @unique
  userId       String
  language     String
  fullText     String
  segmentsJson Json?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  audio        Audio    @relation(fields: [audioId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model AnalysisTemplate {
  id          String   @id @default(cuid())
  name        String
  description String
  category    String
  prompt      String
  isSystem    Boolean  @default(false)
  userId      String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  analyses    AudioAnalysis[]

  @@index([userId])
  @@index([category])
}

model AudioAnalysis {
  id         String   @id @default(cuid())
  audioId    String
  userId     String
  templateId String?
  question   String?
  result     String
  resultJson Json?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  audio      Audio    @relation(fields: [audioId], references: [id], onDelete: Cascade)
  template   AnalysisTemplate? @relation(fields: [templateId], references: [id])

  @@index([audioId])
  @@index([userId])
}

model Tag {
  id        String   @id @default(cuid())
  userId    String
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  audios    AudioTag[]

  @@unique([userId, name])
  @@index([userId])
}

model AudioTag {
  audioId String
  tagId   String

  audio   Audio @relation(fields: [audioId], references: [id], onDelete: Cascade)
  tag     Tag   @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([audioId, tagId])
}

model AudioNote {
  id               String   @id @default(cuid())
  audioId          String
  userId           String
  timestampSeconds Int
  text             String
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  audio            Audio    @relation(fields: [audioId], references: [id], onDelete: Cascade)

  @@index([audioId])
  @@index([userId])
}
```

## 7. Rotas e APIs

### Auth

A autenticação pode ser implementada com Auth.js/NextAuth, Clerk ou outra solução compatível.

Regras:

- Todas as rotas privadas precisam validar sessão.
- Todas as queries precisam usar `userId`.
- Nunca confiar em `userId` enviado pelo client.

### Folders

```txt
GET    /api/folders
POST   /api/folders
PATCH  /api/folders/:folderId
DELETE /api/folders/:folderId
POST   /api/folders/:folderId/move
```

### Audios

```txt
GET    /api/audios
GET    /api/audios/:audioId
PATCH  /api/audios/:audioId
DELETE /api/audios/:audioId
POST   /api/audios/:audioId/move
```

### Upload

```txt
POST /api/upload/audio
```

Responsabilidades:

- Validar usuário.
- Validar tipo do arquivo.
- Validar tamanho.
- Enviar para Vercel Blob.
- Criar registro no banco.
- Retornar metadados do áudio.

### Transcription

```txt
POST /api/audios/:audioId/transcribe
PATCH /api/audios/:audioId/transcript
GET /api/audios/:audioId/transcript
```

Responsabilidades:

- Validar propriedade do áudio.
- Atualizar status para TRANSCRIBING.
- Enviar áudio para API de transcrição.
- Salvar transcrição.
- Atualizar status para TRANSCRIBED.
- Em erro, atualizar status para TRANSCRIPTION_FAILED.

### Analysis

```txt
GET    /api/audios/:audioId/analyses
POST   /api/audios/:audioId/analyses
GET    /api/audios/:audioId/analyses/:analysisId
DELETE /api/audios/:audioId/analyses/:analysisId
```

Payload para análise livre:

```json
{
  "question": "Resuma este áudio em 5 tópicos."
}
```

Payload para template:

```json
{
  "templateId": "template_123"
}
```

### Templates

```txt
GET /api/templates
POST /api/templates
PATCH /api/templates/:templateId
DELETE /api/templates/:templateId
```

No MVP, templates do sistema podem ser seedados no banco.

### Tags

```txt
GET    /api/tags
POST   /api/tags
PATCH  /api/tags/:tagId
DELETE /api/tags/:tagId
POST   /api/audios/:audioId/tags
DELETE /api/audios/:audioId/tags/:tagId
```

### Search

```txt
GET /api/search?q=termo
```

Busca deve considerar:

- Áudios.
- Pastas.
- Tags.
- Transcrições.
- Análises.

## 8. Serviços de Domínio

### AudioService

Responsável por:

- Criar áudio.
- Atualizar metadata.
- Listar áudios.
- Buscar áudio por ID.
- Validar propriedade do áudio.
- Mover áudio.
- Excluir áudio.

### FolderService

Responsável por:

- Criar pasta.
- Atualizar pasta.
- Excluir pasta.
- Mover pasta.
- Gerar árvore.
- Atualizar paths.
- Validar ciclos na árvore.

Regra importante:

Ao mover uma pasta, o sistema deve impedir que ela seja movida para dentro dela mesma ou para dentro de uma subpasta descendente.

### StorageService

Responsável por:

- Enviar arquivos para Vercel Blob.
- Gerar storage key.
- Remover arquivo quando áudio for excluído.
- Validar extensão e MIME type.

### TranscriptionService

Responsável por:

- Recuperar áudio.
- Enviar para API de transcrição.
- Normalizar resposta.
- Salvar transcrição.
- Tratar erros.

### AnalysisService

Responsável por:

- Montar prompt final.
- Buscar transcrição.
- Aplicar template.
- Enviar para modelo de IA.
- Salvar resposta.
- Retornar análise.

### SearchService

Responsável por:

- Busca textual inicial.
- Normalização da query.
- Filtragem por usuário.
- Agregação de resultados.

## 9. Upload e Storage

### Estratégia de upload

Preferir upload direto para storage quando possível, com token assinado ou fluxo seguro. Se isso complicar o MVP, usar Route Handler no servidor para receber o arquivo e enviar para o Blob.

### Chave de armazenamento

```ts
const storageKey = `users/${userId}/audios/${audioId}/original.${extension}`
```

### Segurança

- Não aceitar qualquer tipo de arquivo.
- Validar extensão e MIME type.
- Definir limite de tamanho.
- Não expor arquivos de outros usuários.
- Preferir storage privado para conteúdo pessoal.

## 10. Transcrição

### Fluxo

```txt
1. Usuário clica em Transcrever.
2. API valida sessão.
3. API valida se o áudio pertence ao usuário.
4. API atualiza status para TRANSCRIBING.
5. API obtém o arquivo do storage.
6. API envia o áudio para o serviço de transcrição.
7. API salva o texto retornado.
8. API atualiza status para TRANSCRIBED.
9. UI atualiza a tela.
```

### Prompt ou configuração de transcrição

Quando possível, enviar idioma esperado:

```txt
pt-BR
en
es
it
```

### Observação técnica

Para arquivos grandes, evitar processar tudo em uma única função se houver risco de timeout. Preparar arquitetura futura com filas ou jobs assíncronos.

No MVP, começar simples, mas manter separação de serviço para facilitar evolução.

## 11. Análise com IA

### Prompt base do sistema

```txt
Você é um assistente especializado em analisar transcrições de áudio.
Use exclusivamente a transcrição fornecida como fonte principal.
Quando algo não estiver claro na transcrição, diga que não é possível concluir com segurança.
Responda em português do Brasil, com linguagem clara, objetiva e organizada.
```

### Estrutura para análise livre

```txt
Contexto:
Você está analisando a transcrição de um áudio do usuário.

Transcrição:
{{transcript}}

Pergunta do usuário:
{{question}}

Responda de forma clara, estruturada e útil.
```

### Estrutura para template

```txt
Contexto:
Você está analisando a transcrição de um áudio do usuário.

Transcrição:
{{transcript}}

Tarefa:
{{templatePrompt}}

Responda em português do Brasil.
Organize a resposta com títulos, tópicos e recomendações práticas quando fizer sentido.
```

## 12. Templates Seed Iniciais

Criar seed com os seguintes templates:

1. Resumo básico.
2. Resumo executivo.
3. Palavras mais repetidas.
4. Expressões mais usadas.
5. Clareza da comunicação.
6. Engajamento do discurso.
7. Análise de pregação.
8. Análise de discurso.
9. Análise de reunião.
10. Criação de conteúdo.
11. Análise de evolução pessoal.

## 13. Busca

### MVP

Implementar busca textual simples usando SQL.

Buscar em:

- `Audio.title`
- `Audio.description`
- `Audio.originalFileName`
- `Transcript.fullText`
- `AudioAnalysis.result`
- `Tag.name`
- `Folder.name`

### Futuro

Preparar arquitetura para:

- Embeddings.
- Busca semântica.
- RAG sobre a biblioteca de áudios.
- Perguntas sobre todos os áudios do usuário.

## 14. UI Components Necessários

### Layout

- AppShell.
- Sidebar.
- Topbar.
- Mobile navigation.
- Breadcrumb.

### Audio

- AudioCard.
- AudioList.
- AudioPlayer.
- AudioMetadataPanel.
- AudioStatusBadge.
- AudioUploadDropzone.

### Folders

- FolderTree.
- FolderItem.
- FolderActionsMenu.
- CreateFolderDialog.
- MoveFolderDialog.

### Transcription

- TranscriptViewer.
- TranscriptEditor.
- TranscriptSearch.
- TranscriptionStatus.

### Analysis

- AnalysisPanel.
- AnalysisTemplateCard.
- AnalysisHistory.
- FreeQuestionBox.
- AnalysisResultViewer.

### Tags

- TagBadge.
- TagSelector.
- TagManager.

### Common

- EmptyState.
- LoadingState.
- ErrorState.
- ConfirmDialog.
- Toast notifications.

## 15. Páginas

```txt
/
/login
/register
/dashboard
/audios
/audios/[audioId]
/folders/[folderId]
/templates
/settings
/usage
```

## 16. Validações

### Upload

- Arquivo obrigatório.
- Tipo permitido.
- Tamanho máximo permitido.
- Título obrigatório ou gerado a partir do nome do arquivo.
- Pasta precisa pertencer ao usuário.

### Folder

- Nome obrigatório.
- Não permitir nome vazio.
- Não permitir mover pasta para dentro dela mesma.
- Não permitir mover pasta para descendente.
- Parent folder precisa pertencer ao usuário.

### Audio

- Áudio precisa pertencer ao usuário.
- Não permitir transcrição de áudio inexistente.
- Não permitir análise sem transcrição.

### Analysis

- `question` ou `templateId` precisa existir.
- Template precisa ser do sistema ou pertencer ao usuário.
- Transcrição precisa existir.

## 17. Segurança

- API keys somente no servidor.
- Nunca expor segredo no frontend.
- Proteger todas as APIs privadas.
- Usar autenticação em todas as operações de leitura e escrita.
- Filtrar tudo por `userId`.
- Validar MIME type e extensão.
- Sanitizar inputs textuais.
- Não confiar em IDs recebidos do client sem validar ownership.
- Preferir Vercel Blob privado para áudios pessoais.

## 18. Observabilidade

Implementar logs estruturados para:

- Upload iniciado.
- Upload concluído.
- Erro de upload.
- Transcrição iniciada.
- Transcrição concluída.
- Erro de transcrição.
- Análise iniciada.
- Análise concluída.
- Erro de análise.

Log mínimo:

```json
{
  "event": "audio.transcription.completed",
  "userId": "user_123",
  "audioId": "audio_123",
  "durationMs": 12345
}
```

## 19. Variáveis de Ambiente

```txt
DATABASE_URL=
OPENAI_API_KEY=
BLOB_READ_WRITE_TOKEN=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Ajustar conforme a solução de autenticação escolhida.

## 20. Critérios Técnicos de Aceite

- Projeto roda localmente.
- Projeto faz deploy na Vercel.
- Usuário consegue autenticar.
- Usuário consegue criar pastas.
- Usuário consegue fazer upload de áudio.
- Arquivo é salvo no Blob Storage.
- Metadata é salva no banco.
- Áudio pode ser reproduzido.
- Áudio pode ser transcrito.
- Transcrição é salva no banco.
- Usuário pode editar transcrição.
- Usuário pode rodar análise livre.
- Usuário pode rodar análise por template.
- Análises ficam salvas.
- Busca retorna áudios e transcrições.
- Aplicação funciona em desktop e mobile.

## 21. Prompt Mestre para Gerar o Projeto

```txt
Create a full-stack SaaS web application called "MeusÁudios" using Next.js App Router, React, TypeScript, Tailwind CSS and shadcn/ui.

The application allows authenticated users to upload audio files, organize them into a logical folder tree, transcribe audio using an AI transcription API, and run AI-powered analysis templates over the transcription.

The MVP must include all major features:

1. Authentication
- Users must sign in and access only their own data.
- Every database query must be scoped by userId.
- Protect all private routes and API endpoints.

2. Dashboard
- Show total audios, total duration, transcribed audios, analyses count, recent audios, recent folders, popular tags and upload shortcut.

3. Folder management
- Users can create, rename, delete and move folders.
- Folders are logical records in the database, not physical directories in storage.
- Each folder has id, userId, name, parentId, path, createdAt and updatedAt.
- Render a nested folder tree.
- Users can move audio files between folders.

4. Audio upload
- Users can upload mp3, m4a, wav, ogg and webm files.
- Store audio files in object storage such as Vercel Blob.
- Store only metadata in the database.
- Show upload progress and validation errors.
- Allow selecting folder, content type, language and tags during upload.

5. Audio page
- Each audio has a detail page with player, metadata, tags, notes, transcription and AI analysis panel.

6. Audio player
- Support play, pause, seek, speed control, forward 10 seconds and backward 10 seconds.

7. Timestamp notes
- Users can create, edit and delete notes linked to a timestamp in the audio.

8. Transcription
- User can click a button to transcribe an uploaded audio.
- Send the audio file to an AI transcription API.
- Store the full transcript and optional timestamped segments.
- Show transcription status.
- Allow the user to edit the transcript manually.
- Allow copying and downloading the transcript as txt.

9. AI analysis
- Users can ask free-form questions about the transcript.
- Users can choose predefined analysis templates.
- Store each analysis result in the database.
- Include templates for summary, executive summary, repeated words, repeated expressions, clarity, engagement, sermon analysis, speech analysis, meeting analysis, content generation and personal reflection.

10. Tags
- Users can create tags and assign them to audios.
- Users can filter audios by tag.
- The system can suggest tags with AI.

11. Search
- Users can search by title, description, file name, tag, folder, transcript text and analysis result.
- Start with database text search.
- Keep architecture ready for semantic search later.

12. UI/UX
- Use a modern, vibrant but comfortable SaaS interface.
- Use responsive design.
- Use sidebar navigation with folders.
- Use cards for audio items.
- Use modals or drawers for upload, folder creation and move actions.
- Use loading, empty and error states.

13. Security
- Validate file types and file size.
- Never expose another user's audio.
- Protect all API routes.
- Keep API keys only on the server.

Generate the initial project structure, Prisma schema, route handlers, services, React components, seed data for templates and a polished responsive UI.
```
