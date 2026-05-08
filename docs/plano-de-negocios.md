# MeusÁudios — Plano de Negócios e Especificações do Produto

## 0. Estado de Implementação (MVP)

> Esta seção reflete o estado real do código em `main` após a implementação inicial do MVP. Atualizada em 2026-05-08.

| Funcionalidade | Status | Tickets | Observações |
| --- | --- | --- | --- |
| Cadastro / Login email + senha | ✅ Done | VIR-12 | Credentials provider com bcryptjs (12 salt rounds) |
| Login com Google | ✅ Done (UI + provider) | VIR-13 | Botão renderiza condicionalmente quando `GOOGLE_CLIENT_ID/SECRET` existem |
| Recuperação de senha | ⏸️ Placeholder | VIR-14 | Página existe; implementação real depende de provider de email transacional |
| Middleware de proteção de rotas | ✅ Done | VIR-15 | Edge-safe via split de auth.config |
| AppShell (Sidebar, Topbar, breakpoints) | ✅ Done | VIR-10 | Drawer mobile (≤1024px) é polish futuro |
| Folders (CRUD, árvore, mover) | ✅ Done | VIR-17/18/19/20/21 | FolderService com cascade de paths e validação de ciclos |
| Upload de áudio | ✅ Done | VIR-22/23/24/25 | Drag-drop + multipart + progresso real via XHR |
| Biblioteca + filtros | ✅ Done | VIR-26/27/28/29 | Filter tabs por status + página de pasta dedicada |
| Áudios CRUD + mover | ✅ Done | VIR-30 | Cascade Blob cleanup ao excluir |
| Página do áudio + Player | ✅ Done | VIR-31/32/33 | HTML5 audio + controles custom (sem wavesurfer no MVP) |
| Notas por timestamp | ✅ Done | VIR-34 | Click no timestamp faz seek do player |
| Transcrição (Whisper) | ✅ Done | VIR-35/36/37/38/39 | `verbose_json` com segments + edição manual + export TXT |
| Análise com IA (free + templates) | ✅ Done | VIR-40/41 | gpt-4o-mini default, transcript truncado em 80k chars |
| 11 templates do sistema | ✅ Done | VIR-42 | Seed via `npm run db:seed` (idempotente) |
| FreeQuestionBox + ResultViewer + History | ✅ Done | VIR-43/44/45 | Tudo num único `AnalysisPanel` |
| Galeria de templates `/templates` | ✅ Done | VIR-46 | Agrupada por categoria |
| Tags (CRUD + associação) | ✅ Done | VIR-47/48 | TagBadge + APIs; multi-select inline fica para evolução |
| Sugestão automática de tags via IA | ❌ Cancelado | VIR-49 | Low priority — backlog futuro |
| Search global ⌘K | ✅ Done | VIR-50/51 | Busca em audios, folders, tags, transcripts, analyses |
| Dashboard | ✅ Done | VIR-52/53 | 4 métricas + recentes + templates recomendados |
| Configurações + perfil | ✅ Done | VIR-16/54 | Edit nome + zona de perigo (excluir conta) |
| Landing page polida | ✅ Done | VIR-11 | Hero + how-it-works + use cases |
| Empty/Loading/Error/Confirm primitives | ✅ Done | VIR-56/57/58/59 | Reutilizáveis em `src/components/ui/` |
| Logging estruturado | ✅ Done | VIR-61 | `withTimedLog` aplicado em transcription |
| Métricas avançadas (WPM etc) | ✅ Done | VIR-55 | `computeAudioMetrics` derivada da transcrição |
| Responsividade + a11y básicas | ✅ Done | VIR-62 | Drawer mobile detalhado fica para iteração |
| Domínio meusaudios.com.br + DNS | 📋 Manual | VIR-63 | Vercel Dashboard → Settings → Domains |

**Decisões importantes que diferem do plano original:**

- **Session strategy:** JWT em vez de `database` (Credentials provider do Auth.js v5 não suporta sessões em banco).
- **Idiomas suportados na transcrição:** pt-BR, en, es, it (mapeados internamente para os códigos ISO `pt`, `en`, `es`, `it` antes de mandar para o Whisper).
- **Modelo de análise:** `gpt-4o-mini` por padrão, sobrescrevível via env `OPENAI_ANALYSIS_MODEL`.
- **Truncamento de transcrição:** 80k caracteres (custo + janela do modelo). Texto truncado é sinalizado no prompt.
- **Storage privacy:** Vercel Blob `access: "public"` com URL unguessable via prefixo `userId/audioId`. Hardening com URL assinada fica em backlog quando produto crescer.
- **Tags AI suggestion (VIR-49)** cancelada para o MVP.

A partir daqui, a especificação original permanece como referência de produto e não foi reescrita.

## 1. Identidade do Produto

**Nome do produto:** MeusÁudios  
**Domínio:** meusaudios.com.br  
**Tipo:** Aplicação web SaaS  
**Categoria:** Organização, transcrição e análise inteligente de áudios  
**Plataforma inicial:** Web responsiva  
**Modelo inicial:** Produto individual com possibilidade futura de planos pagos

## 2. Visão do Produto

O MeusÁudios é uma aplicação web para organizar, transcrever, pesquisar e analisar áudios pessoais, profissionais, religiosos, acadêmicos ou criativos.

O usuário pode fazer upload de áudios vindos do WhatsApp, gravações de celular, reuniões, palestras, pregações, aulas, discursos, podcasts, entrevistas ou qualquer outro arquivo de áudio. Depois do upload, o sistema permite organizar os arquivos em uma estrutura lógica de pastas, transcrever o conteúdo e executar análises com inteligência artificial usando templates prontos ou perguntas livres.

A proposta central do produto é transformar arquivos de áudio, que normalmente ficam perdidos em conversas, celulares e pastas desorganizadas, em conhecimento estruturado, pesquisável e reutilizável.

## 3. Proposta de Valor

O MeusÁudios ajuda o usuário a:

- Guardar áudios importantes em um só lugar.
- Organizar os áudios em pastas e subpastas.
- Transcrever automaticamente o conteúdo falado.
- Pesquisar dentro dos áudios usando texto.
- Fazer perguntas sobre o conteúdo do áudio.
- Gerar resumos, análises, insights e conteúdos derivados.
- Avaliar discursos, pregações, reuniões e aulas.
- Recuperar ideias importantes que estavam escondidas em arquivos de áudio.

## 4. Frases de Posicionamento

Sugestão principal:

> Transforme seus áudios em conhecimento organizado.

Outras possibilidades:

> Seus áudios organizados, transcritos e inteligentes.

> Nunca mais perca uma ideia dentro de um áudio.

> Guarde, transcreva e entenda tudo o que você falou ou ouviu.

> O lugar certo para organizar e analisar seus áudios.

## 5. Problema que o Produto Resolve

Muitas pessoas recebem, gravam ou acumulam áudios importantes, mas esses arquivos ficam espalhados em aplicativos como WhatsApp, Telegram, celular, Google Drive, e-mail ou pastas locais.

O problema é que o áudio é difícil de consultar rapidamente. Para encontrar uma informação, o usuário precisa ouvir tudo novamente. Além disso, é difícil organizar, comparar, resumir ou reaproveitar o conteúdo de um áudio.

O MeusÁudios resolve esse problema transformando cada áudio em um item organizado, transcrito, pesquisável e analisável por inteligência artificial.

## 6. Público-Alvo Inicial

### Usuários individuais

- Pessoas que recebem muitos áudios no WhatsApp.
- Pessoas que gravam reflexões pessoais.
- Pessoas que fazem anotações por voz.
- Pessoas que querem guardar ideias, pensamentos e estudos.

### Profissionais

- Professores.
- Mentores.
- Consultores.
- Vendedores.
- Líderes.
- Criadores de conteúdo.
- Palestrantes.
- Product Managers.
- Engenheiros e profissionais técnicos que gravam reuniões ou explicações.

### Contexto religioso e comunitário

- Pregadores.
- Pastores.
- Catequistas.
- Líderes de grupos.
- Pessoas que gravam reflexões, estudos bíblicos, orações e mensagens.

### Contexto educacional

- Alunos.
- Professores.
- Pessoas estudando idiomas.
- Pessoas que gravam aulas, revisões, explicações e seminários.

## 7. MVP — Escopo Completo Desejado

Para este projeto, o MVP deve conter todas as funcionalidades abaixo. A ideia não é fazer uma versão mínima demais, mas sim uma primeira versão completa o suficiente para validar o produto com uma experiência rica.

## 8. Funcionalidades do Produto

### 8.1 Autenticação e Usuário

O sistema deve permitir que cada usuário tenha uma conta própria e acesse apenas os seus dados.

Funcionalidades:

- Criar conta.
- Login.
- Logout.
- Login com Google, se possível.
- Recuperação de senha, se aplicável à solução de autenticação escolhida.
- Tela de perfil.
- Controle de sessão.
- Proteção de rotas autenticadas.
- Dados sempre filtrados por usuário.

Regras:

- Um usuário nunca pode acessar áudios, pastas, transcrições ou análises de outro usuário.
- Toda consulta ao banco precisa considerar o `userId`.
- Toda chamada de API precisa validar autenticação.

### 8.2 Dashboard

Após login, o usuário deve acessar um dashboard com visão geral da sua conta.

Componentes do dashboard:

- Total de áudios enviados.
- Total de minutos ou horas armazenados.
- Total de áudios transcritos.
- Total de análises realizadas.
- Últimos áudios enviados.
- Pastas recentes.
- Tags mais usadas.
- Botão principal para upload.
- Barra de busca global.
- Atalhos para templates de análise.

### 8.3 Upload de Áudio

O usuário deve conseguir enviar um ou mais arquivos de áudio.

Funcionalidades:

- Upload por botão.
- Upload por drag and drop.
- Upload múltiplo.
- Barra de progresso.
- Validação de tipo de arquivo.
- Validação de tamanho máximo.
- Seleção de pasta destino.
- Campo para título do áudio.
- Campo para descrição opcional.
- Seleção de idioma esperado.
- Seleção de tipo de conteúdo.
- Adição de tags durante o upload.

Formatos aceitos:

- mp3
- m4a
- wav
- ogg
- webm
- mp4, se o arquivo tiver áudio e for suportado pela transcrição

Tipos de conteúdo sugeridos:

- WhatsApp
- Reunião
- Aula
- Pregação
- Discurso
- Podcast
- Entrevista
- Ideia pessoal
- Anotação de voz
- Estudo
- Oração
- Outro

Estados do upload:

- Aguardando arquivo.
- Validando arquivo.
- Enviando arquivo.
- Upload concluído.
- Erro no upload.

### 8.4 Organização por Pastas

A aplicação deve permitir que o usuário organize seus áudios em uma estrutura livre de pastas e subpastas.

Funcionalidades:

- Criar pasta.
- Criar subpasta.
- Renomear pasta.
- Excluir pasta.
- Mover pasta.
- Mover áudio entre pastas.
- Listar áudios por pasta.
- Exibir árvore de pastas.
- Exibir breadcrumb de navegação.
- Permitir estrutura com múltiplos níveis.
- Permitir pasta raiz.
- Permitir áudio sem pasta, se necessário.

Regra importante:

A estrutura de pastas deve ser lógica, não física. Os arquivos de áudio podem ficar armazenados em um bucket/blob storage com uma chave técnica, enquanto a organização visual do usuário é controlada pelo banco de dados.

Exemplo:

```txt
/
├── Igreja
│   ├── Pregações
│   ├── Estudos bíblicos
│   └── Orações
├── Trabalho
│   ├── Reuniões
│   └── Ideias
├── Pessoal
│   ├── Reflexões
│   └── WhatsApp
```

### 8.5 Listagem de Áudios

O usuário deve conseguir visualizar seus áudios de forma simples e organizada.

Funcionalidades:

- Lista de áudios.
- Cards de áudio.
- Filtros por pasta.
- Filtros por tag.
- Filtros por tipo de conteúdo.
- Filtros por status de transcrição.
- Ordenação por data de upload.
- Ordenação por nome.
- Ordenação por duração.
- Busca por título.
- Busca por descrição.
- Busca por conteúdo transcrito.

Cada card de áudio deve mostrar:

- Título.
- Duração.
- Data de upload.
- Status da transcrição.
- Pasta.
- Tags.
- Tipo de conteúdo.
- Botão para abrir.
- Botão para transcrever, se ainda não estiver transcrito.

### 8.6 Página do Áudio

Cada áudio deve ter uma página própria.

Elementos da página:

- Player de áudio.
- Metadados do arquivo.
- Pasta atual.
- Tags.
- Transcrição.
- Painel de perguntas com IA.
- Painel de templates de análise.
- Histórico de análises.
- Notas por timestamp.

### 8.7 Player de Áudio

Funcionalidades do player:

- Play.
- Pause.
- Avançar 10 segundos.
- Voltar 10 segundos.
- Controle de velocidade.
- Mostrar tempo atual.
- Mostrar duração total.
- Barra de progresso.
- Volume.
- Se possível, visualização de waveform.

Velocidades sugeridas:

- 0.75x
- 1x
- 1.25x
- 1.5x
- 2x

### 8.8 Notas por Timestamp

O usuário deve poder criar notas vinculadas a momentos específicos do áudio.

Funcionalidades:

- Criar nota no tempo atual do áudio.
- Editar nota.
- Excluir nota.
- Clicar na nota para ir ao timestamp.
- Listar notas em ordem cronológica.

Exemplo:

```txt
00:02:14 — Ideia importante sobre disciplina.
00:05:48 — Exemplo usado na pregação.
00:12:20 — Pergunta feita à audiência.
```

### 8.9 Transcrição

O usuário deve conseguir transcrever automaticamente o áudio.

Funcionalidades:

- Botão "Transcrever áudio".
- Status da transcrição.
- Transcrição automática.
- Seleção de idioma.
- Salvamento do texto transcrito.
- Edição manual da transcrição.
- Busca dentro da transcrição.
- Copiar transcrição.
- Baixar transcrição como `.txt`.
- Preparar arquitetura para exportar `.docx` e `.pdf` no futuro.

Status da transcrição:

- UPLOADED
- TRANSCRIPTION_PENDING
- TRANSCRIBING
- TRANSCRIBED
- TRANSCRIPTION_FAILED

Estrutura esperada:

```json
{
  "audioId": "audio_123",
  "language": "pt-BR",
  "fullText": "Texto completo da transcrição...",
  "segments": [
    {
      "start": 0,
      "end": 12.4,
      "text": "Bom dia, pessoal..."
    },
    {
      "start": 12.5,
      "end": 25.1,
      "text": "Hoje eu queria falar sobre..."
    }
  ]
}
```

### 8.10 Perguntas Livres com IA

Após a transcrição, o usuário deve poder fazer perguntas livres sobre o áudio.

Exemplos:

- Resuma esse áudio em 5 tópicos.
- Quais foram os principais argumentos?
- Quais perguntas foram feitas?
- Esse discurso foi convincente?
- Quais pontos ficaram confusos?
- Que título eu poderia dar para esse áudio?
- Gere uma descrição para YouTube.
- Gere um post para Instagram com base nesse áudio.
- Quais foram as ideias principais?
- Quais ações foram sugeridas?

Regras:

- A IA deve usar a transcrição como contexto principal.
- A resposta deve ser salva no histórico de análises.
- O usuário deve poder copiar a resposta.
- O usuário deve poder renomear ou excluir análises salvas.

### 8.11 Templates de Análise com IA

O sistema deve oferecer templates prontos de análise.

Categorias:

- Resumo
- Discurso
- Pregação
- Reunião
- Aula
- Podcast
- Vendas
- Comunicação
- Conteúdo social
- Estudo
- Reflexão pessoal

Templates iniciais:

#### Resumo básico

Gere um resumo claro e objetivo deste áudio em até 10 tópicos. Destaque as ideias principais, exemplos importantes e conclusões.

#### Resumo executivo

Gere um resumo executivo deste áudio. Inclua contexto, principais pontos, decisões ou conclusões e próximas ações.

#### Palavras mais repetidas

Analise a transcrição e liste as 10 palavras mais repetidas, ignorando artigos, preposições e palavras muito comuns. Para cada palavra, informe a quantidade aproximada de ocorrências e o possível significado dentro do contexto.

#### Expressões mais usadas

Identifique expressões, frases ou padrões de linguagem que aparecem repetidamente neste áudio. Explique o que isso revela sobre o estilo de comunicação do orador.

#### Clareza da comunicação

Avalie a clareza da comunicação neste áudio considerando organização das ideias, uso de exemplos, repetições excessivas, frases confusas e progressão lógica. Dê uma nota de 0 a 10 e explique.

#### Engajamento do discurso

Avalie o nível de engajamento deste áudio considerando novos fatos apresentados, histórias ou exemplos usados, perguntas feitas à audiência, perguntas reflexivas, momentos de conexão emocional e chamadas para ação. Dê uma nota de 0 a 10 e sugira melhorias.

#### Análise de pregação

Analise esta pregação considerando tema central, texto bíblico principal, estrutura da mensagem, aplicação prática, clareza espiritual, uso de exemplos, chamado à reflexão, chamado à ação, pontos fortes e pontos que poderiam ser melhorados.

#### Análise de discurso

Analise este discurso considerando objetivo principal, público-alvo provável, tese defendida, argumentos usados, evidências apresentadas, ritmo da fala, clareza, persuasão, fechamento e melhorias sugeridas.

#### Análise de reunião

Analise esta reunião e extraia participantes mencionados, assuntos discutidos, decisões tomadas, pendências, responsáveis, prazos mencionados, riscos ou bloqueios e próximos passos.

#### Criação de conteúdo

Transforme este áudio em conteúdos reutilizáveis: post para LinkedIn, post para Instagram, roteiro curto para vídeo, título chamativo, descrição curta e cinco frases de impacto.

#### Análise de evolução pessoal

Analise este áudio como uma reflexão pessoal. Identifique emoções predominantes, preocupações, ideias recorrentes, decisões implícitas, possíveis próximos passos e perguntas que o usuário deveria se fazer.

### 8.12 Métricas e Insights

O sistema deve calcular ou gerar, quando possível:

- Duração total.
- Quantidade aproximada de palavras.
- Palavras por minuto.
- Palavras mais repetidas.
- Expressões mais usadas.
- Temas principais.
- Tom geral.
- Clareza.
- Objetividade.
- Engajamento.
- Persuasão.
- Quantidade de perguntas feitas.
- Quantidade de exemplos usados.
- Quantidade de chamadas para ação.
- Sentimento geral.
- Complexidade do vocabulário.
- Repetições excessivas.
- Ideias novas apresentadas.
- Pontos de melhoria.

Para discurso e pregação, incluir:

- Tema central.
- Introdução forte ou fraca.
- Desenvolvimento lógico.
- Uso de histórias.
- Uso de perguntas reflexivas.
- Aplicação prática.
- Momento de maior impacto.
- Fechamento.
- Chamada final.

### 8.13 Tags

O usuário deve conseguir organizar áudios com tags.

Funcionalidades:

- Criar tag.
- Editar tag.
- Excluir tag.
- Associar tag ao áudio.
- Remover tag do áudio.
- Filtrar áudios por tag.
- Sugerir tags automaticamente com IA.

Exemplos de tags:

- pregação
- trabalho
- reunião
- ideia
- família
- estudo
- vendas
- comunicação
- oração
- liderança
- disciplina
- produtividade

### 8.14 Busca Global

O usuário deve conseguir pesquisar em toda a sua base de áudios.

A busca deve considerar:

- Título.
- Descrição.
- Nome do arquivo.
- Pasta.
- Tags.
- Transcrição.
- Resultado de análises.

Exemplos de busca:

- "disciplina"
- "pregações sobre fé"
- "áudios em que falei sobre liderança"
- "reuniões com decisão pendente"

No MVP, a busca pode ser textual. A arquitetura deve permitir busca semântica no futuro.

### 8.15 Histórico de Análises

Cada análise feita com IA deve ser salva.

Funcionalidades:

- Listar análises de um áudio.
- Abrir análise anterior.
- Copiar análise.
- Excluir análise.
- Ver qual template foi usado.
- Ver data de criação.
- Ver pergunta livre usada, quando aplicável.

### 8.16 Exportação

Para o MVP, implementar pelo menos:

- Copiar transcrição.
- Baixar transcrição como `.txt`.
- Copiar análise.

Preparar para versões futuras:

- Exportar transcrição como PDF.
- Exportar análise como PDF.
- Exportar transcrição como DOCX.
- Exportar relatório completo do áudio.

## 9. Principais Telas

### 9.1 Landing Page

Objetivo: apresentar o produto e converter o usuário para login/cadastro.

Seções:

- Hero com frase principal.
- Demonstração visual do produto.
- Benefícios.
- Casos de uso.
- Como funciona.
- CTA para começar.

### 9.2 Login/Cadastro

Tela simples, moderna e confiável.

### 9.3 Dashboard

Visão geral dos áudios, métricas e atalhos.

### 9.4 Tela de Biblioteca

Tela principal de organização dos áudios com sidebar de pastas e lista de arquivos.

### 9.5 Tela de Pasta

Mostra o conteúdo de uma pasta específica.

### 9.6 Tela do Áudio

Player, transcrição, notas, análise com IA e histórico.

### 9.7 Tela de Templates

Lista de templates prontos e possibilidade futura de templates personalizados.

### 9.8 Tela de Configurações

Perfil, preferências, idioma padrão, uso e limites.

## 10. Regras de Negócio

- Todo áudio pertence a um usuário.
- Toda pasta pertence a um usuário.
- Toda transcrição pertence a um áudio e a um usuário.
- Toda análise pertence a um áudio e a um usuário.
- Um áudio pode estar em zero ou uma pasta.
- Uma pasta pode ter zero ou muitos áudios.
- Uma pasta pode ter zero ou muitas subpastas.
- Uma tag pertence a um usuário.
- Um áudio pode ter muitas tags.
- Uma tag pode estar associada a muitos áudios.
- O arquivo físico não deve depender da estrutura visual de pastas.
- Mover uma pasta deve alterar a organização lógica, não mover arquivos físicos no storage.
- O usuário só pode executar análises em áudios que já possuem transcrição.
- O usuário pode editar a transcrição manualmente.
- As análises devem usar a transcrição mais atual disponível.

## 11. Estados de Áudio

```txt
UPLOADED
TRANSCRIPTION_PENDING
TRANSCRIBING
TRANSCRIBED
TRANSCRIPTION_FAILED
ANALYSIS_PENDING
ANALYZING
ANALYZED
ANALYSIS_FAILED
```

## 12. Critérios de Sucesso do MVP

O MVP será considerado bem-sucedido se permitir que o usuário:

1. Crie uma conta.
2. Faça login.
3. Crie pastas e subpastas.
4. Faça upload de áudios.
5. Organize áudios em pastas.
6. Reproduza áudios no player.
7. Transcreva áudios.
8. Edite a transcrição.
9. Faça perguntas livres sobre o áudio.
10. Use templates prontos de análise.
11. Salve e consulte análises anteriores.
12. Busque áudios por título, tag, pasta ou transcrição.
13. Use a aplicação em desktop e mobile.

## 13. Fora do Escopo Inicial

Não implementar no primeiro MVP, salvo se sobrar tempo:

- Aplicativo mobile nativo.
- Compartilhamento público de áudios.
- Equipes e colaboração multiusuário.
- Pagamentos e planos pagos.
- Exportação avançada em PDF/DOCX.
- Busca semântica com embeddings.
- Diarização avançada de múltiplos falantes.
- Edição avançada de áudio.
- Corte de áudio.
- Upload via integração direta com WhatsApp.

## 14. Prompt de Contexto para Claude

Use este produto como contexto para desenvolvimento:

O projeto se chama MeusÁudios. É uma aplicação web SaaS responsiva para upload, organização, transcrição e análise inteligente de áudios. O usuário pode criar uma estrutura livre de pastas e subpastas, fazer upload de arquivos de áudio, reproduzir esses áudios, transcrevê-los com IA, editar a transcrição, pesquisar dentro da transcrição, usar templates prontos de análise e fazer perguntas livres sobre o conteúdo do áudio.

A aplicação deve ser construída com foco em organização, produtividade e inteligência. O diferencial principal não é somente armazenar arquivos, mas transformar áudios em conhecimento estruturado, pesquisável e reutilizável.

O MVP deve conter todas as funcionalidades descritas neste documento.
