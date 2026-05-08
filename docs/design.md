# MeusÁudios — Design Guidelines

> Documento original era foco em prompt para Google Stitch. Após o MVP, vira a fonte de verdade visual do produto. Tudo aqui já está implementado em `src/components/` e `src/app/globals.css`.
>
> **Estado atual (2026-05-08):** paleta laranja em produção, tipografia Plus Jakarta Sans + Fraunces + JetBrains Mono carregadas via `next/font/google`, primitives shadcn-style em `src/components/ui/` (Button, Input, Dialog, EmptyState, Skeleton, Toast, ConfirmDialog).

## 1. Objetivo do Design

Criar uma interface moderna, vibrante, responsiva e agradável para uma aplicação SaaS chamada MeusÁudios.

O produto permite que usuários façam upload de áudios, organizem arquivos em pastas, transcrevam o conteúdo e façam análises com inteligência artificial.

A interface deve transmitir:

- Organização.
- Inteligência.
- Confiança.
- Clareza.
- Produtividade.
- Modernidade.
- Leveza.

O produto não deve parecer um sistema corporativo pesado. Também não deve parecer um app infantil ou exageradamente colorido. A proposta é uma plataforma vibrante, mas elegante e fácil de usar por longos períodos.

## 2. Nome do Produto

**MeusÁudios**

Importante manter o acento no nome da marca quando aparecer em títulos, logo e cabeçalhos.

## 3. Personalidade Visual

A identidade visual deve combinar:

- SaaS moderno.
- Biblioteca pessoal de mídia.
- Ferramenta de produtividade.
- Plataforma com IA.
- Organização visual por pastas e conteúdo.

Palavras-chave:

- Vibrante.
- Limpo.
- Intuitivo.
- Confiável.
- Inteligente.
- Acolhedor.
- Produtivo.

## 4. Direção de Cores

Paleta vibrante e quente coordenada em torno do laranja, com tons análogos (rose, âmbar) para acento e verde como complementar.

### Cores principais

#### Laranja queimado (primary)

Cor primária para CTAs, links, foco e elementos de ação.

```txt
Primary: #EA580C
Primary dark: #9A3412
Primary light: #FFEDD5
```

#### Rose moderno (accent)

Acento para destaques de IA, cards especiais e gradientes.

```txt
Accent: #E11D48
Accent light: #FFE4E6
Accent dark: #9F1239
```

#### Âmbar dourado (info)

Tom informativo para elementos de áudio, ondas sonoras, estados e detalhes visuais.

```txt
Info: #D97706
Info light: #FEF3C7
Info dark: #92400E
```

#### Verde energético (success)

Estados positivos, sucesso, transcrição concluída e confirmações. Verde mantido por contraste complementar com o laranja.

```txt
Success: #10B981
Success light: #ECFDF5
Success dark: #047857
```

#### Amarelo deeper (warning)

Alertas leves, pendências e status em processamento. Tom mais profundo que o âmbar do info para evitar conflito visual.

```txt
Warning: #CA8A04
Warning light: #FEF9C3
Warning dark: #854D0E
```

#### Vermelho profundo (error)

Erros e ações destrutivas. Tom mais profundo para se distanciar do rose accent.

```txt
Error: #DC2626
Error light: #FEE2E2
Error dark: #B91C1C
```

### Neutros

```txt
Background: #F8FAFC
Surface: #FFFFFF
Surface muted: #F1F5F9
Border: #E2E8F0
Text primary: #0F172A
Text secondary: #475569
Text muted: #94A3B8
```

## 5. Uso de Gradientes

Usar gradientes com moderação para dar personalidade ao produto. Toda paleta de gradiente é quente: laranja → rose → âmbar.

```txt
Gradient primary: linear-gradient(135deg, #EA580C 0%, #E11D48 55%, #D97706 100%)
Gradient soft:    linear-gradient(135deg, #FFEDD5 0%, #FFE4E6 50%, #FEF3C7 100%)
Gradient mesh:    radial(20% 0%, #FFEDD5), radial(80% 0%, #FFE4E6), radial(50% 100%, #FEF3C7)
```

Aplicar gradientes em:

- Hero da landing page.
- Cards de destaque (especialmente o cover do áudio na página de detalhe).
- Botão primário (gradient sólido para forte presença).
- Área de IA/análise (mesh radial sutil de fundo).
- Ilustrações de waveform (stroke colorido).
- Brand mark da logo MeusÁudios.

Sombras com glow primário usam o laranja:

```txt
Shadow glow: 0 16px 48px -12px rgba(234, 88, 12, 0.35)
```

Evitar gradiente em tudo. Maior parte da interface permanece neutra com superfícies brancas.

## 6. Tipografia

Pareamento de duas famílias para contraste editorial:

- **Display: Fraunces** (serif moderno, suporta itálico expressivo). Usado em wordmark "Meus*Áudios*" (com itálico no acento), H1, H2, números grandes (métricas, durações destacadas) e nomes de templates.
- **Body: Plus Jakarta Sans** (sans-serif geométrico). Usado em todo corpo de texto, navegação, badges, controles, formulários e cards.
- **Mono: JetBrains Mono**. Usado em timestamps de transcrição, durações no player, atalhos de teclado (`⌘K`, `U`), códigos numéricos.

Hierarquia:

```txt
H1 hero (Fraunces 400 italic):       64px / line-height 1.02 / letter-spacing -0.035em
H1 page (Fraunces 500):              36-40px / 1.05 / -0.025em
H2 section (Fraunces 400):           44px / 1.05 / -0.025em
H3 panel (Fraunces 500):             19-22px / 1.2 / -0.015em
Display number (Fraunces 500):       32px / 1 / -0.02em
Body (Plus Jakarta Sans 400):        15-16px / 1.5
Small (Plus Jakarta Sans 500):       13-14px
Caption / meta (Plus Jakarta Sans):  11-12px / uppercase letterspaced quando label
Mono caption (JetBrains Mono):       11-12px
```

Usar itálico do Fraunces para palavras de ênfase em títulos (ex.: "Meus*Áudios*", "Bom dia, *Marcelo*"). Boa densidade sem aperto — espaçamento vertical entre seções com pelo menos 28-36px no desktop.

## 7. Estilo dos Componentes

### Cards

- Fundo branco.
- Bordas suaves.
- Border radius entre 16px e 24px.
- Sombra leve.
- Espaçamento interno generoso.
- Estados hover sutis.

Exemplo visual:

```txt
Card:
- background: white
- border: 1px solid #E2E8F0
- border-radius: 20px
- box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06)
```

### Botões

#### Primário

- Fundo azul violeta ou gradiente.
- Texto branco.
- Bordas arredondadas.
- Forte presença visual.

#### Secundário

- Fundo claro.
- Texto escuro ou primário.
- Borda suave.

#### Destrutivo

- Vermelho suave.
- Usar apenas para excluir áudio, pasta, tag ou análise.

### Inputs

- Altura confortável.
- Bordas suaves.
- Estado de foco visível.
- Ícones quando fizer sentido.
- Placeholder claro, mas não escuro demais.

### Badges

Usar badges para:

- Status da transcrição.
- Tags.
- Tipo de conteúdo.
- Duração.

Mapeamento status → cor:

```txt
Transcrito:    verde (success-light bg, success-dark text)
Transcrevendo: amarelo (warning-light bg, warning-dark text) com pulse no dot
Erro:          vermelho (error-light bg, error-dark text)
Upload feito:  laranja primary (primary-light bg, primary-dark text)
IA:            rose accent (accent-light bg, accent-dark text)
Áudio info:    âmbar dourado (info-light bg, info-dark text)
```

Cada badge segue o padrão pill (radius 999px) com dot opcional à esquerda para enfatizar status.

## 8. Iconografia

Usar ícones lineares, modernos e leves.

Sugestão:

- lucide-react style.

Ícones importantes:

- Upload.
- Folder.
- Folder open.
- Audio wave.
- Play.
- Pause.
- Search.
- Sparkles/AI.
- File text.
- Tags.
- Clock.
- More horizontal.
- Settings.
- Trash.
- Edit.
- Move.

## 9. Layout Geral da Aplicação

A aplicação autenticada deve ter estrutura de SaaS:

```txt
┌─────────────────────────────────────────────┐
│ Topbar                                      │
├──────────────┬──────────────────────────────┤
│ Sidebar      │ Main Content                 │
│ Folders      │                              │
│ Navigation   │                              │
└──────────────┴──────────────────────────────┘
```

### Sidebar

A sidebar deve conter:

- Logo MeusÁudios.
- Botão de upload.
- Navegação principal.
- Árvore de pastas.
- Atalho para templates.
- Atalho para configurações.

Navegação:

- Dashboard.
- Biblioteca.
- Recentes.
- Favoritos, se incluído.
- Templates.
- Configurações.

### Topbar

A topbar deve conter:

- Breadcrumb.
- Busca global.
- Botão de upload.
- Avatar/menu do usuário.

### Main Content

Área principal deve mudar conforme a página:

- Dashboard.
- Lista de áudios.
- Página do áudio.
- Templates.
- Configurações.

## 10. Responsividade

A interface precisa funcionar bem em:

- Desktop grande.
- Notebook.
- Tablet.
- Mobile.

### Desktop

- Sidebar fixa à esquerda.
- Topbar fixa ou sticky.
- Conteúdo em grid.
- Cards em múltiplas colunas.

### Tablet

- Sidebar pode ficar recolhível.
- Conteúdo em duas colunas.
- Player e transcrição podem ficar empilhados se necessário.

### Mobile

- Sidebar vira drawer.
- Navegação principal pode ir para menu inferior ou botão de menu.
- Cards em uma coluna.
- Upload deve ser acessível por botão flutuante ou botão destacado.
- Página do áudio deve empilhar: player, metadados, transcrição, análises.

## 11. Landing Page

Criar uma landing page moderna para o produto.

### Hero

Conteúdo:

```txt
Título: Seus áudios organizados, transcritos e inteligentes.
Subtítulo: Faça upload de áudios, organize em pastas, transcreva automaticamente e use IA para gerar resumos, análises e insights.
CTA principal: Começar agora
CTA secundário: Ver como funciona
```

Visual:

- Fundo com gradiente suave.
- Mockup da aplicação.
- Elementos visuais de onda sonora.
- Ícones de pasta, áudio e IA.

### Seção Como Funciona

Três passos:

1. Envie seus áudios.
2. Organize em pastas.
3. Transcreva e analise com IA.

### Seção Casos de Uso

Cards:

- WhatsApp.
- Reuniões.
- Pregações.
- Aulas.
- Discursos.
- Ideias pessoais.

### Seção Benefícios

- Encontre qualquer ideia rapidamente.
- Transforme áudio em texto.
- Gere resumos e insights.
- Organize tudo em pastas.
- Reutilize conteúdo em posts, roteiros e estudos.

## 12. Dashboard

O dashboard deve ser visualmente forte e útil.

Componentes:

- Header com saudação.
- CTA de upload.
- Cards de métricas.
- Lista de áudios recentes.
- Pastas recentes.
- Templates recomendados.
- Busca global.

Métricas:

- Total de áudios.
- Horas armazenadas.
- Áudios transcritos.
- Análises geradas.

Estilo:

- Cards com ícones coloridos.
- Seção principal clara.
- Espaçamento generoso.

## 13. Biblioteca de Áudios

Tela principal de organização.

Layout desktop:

```txt
Sidebar de pastas | Lista/Grid de áudios
```

A lista de áudios deve permitir alternar entre:

- Grid view.
- List view.

Card de áudio:

- Ícone ou mini waveform.
- Título.
- Duração.
- Pasta.
- Tags.
- Status.
- Data.
- Menu de ações.

Ações:

- Abrir.
- Renomear.
- Mover.
- Transcrever.
- Excluir.

## 14. Upload Modal / Drawer

O upload deve parecer simples e poderoso.

Elementos:

- Área de drag and drop.
- Lista de arquivos selecionados.
- Progresso por arquivo.
- Campo de título.
- Pasta destino.
- Tipo de conteúdo.
- Idioma.
- Tags.
- Botão enviar.

Estados:

- Vazio.
- Arrastando arquivo.
- Enviando.
- Sucesso.
- Erro.

## 15. Página do Áudio

Essa é a tela mais importante do produto.

Layout desktop recomendado:

```txt
┌──────────────────────────────────────────────┐
│ Header do áudio                              │
├──────────────────────┬───────────────────────┤
│ Player + Metadata    │ Transcrição           │
│ Notas                │                       │
├──────────────────────┴───────────────────────┤
│ Painel de IA / Templates / Histórico          │
└──────────────────────────────────────────────┘
```

Alternativa:

- Coluna esquerda: player, notas, metadata.
- Coluna direita: transcrição.
- Abaixo: análise com IA.

### Header do áudio

Mostrar:

- Título.
- Status.
- Duração.
- Pasta.
- Tags.
- Ações.

### Player

Visual moderno:

- Waveform ou barra de progresso grande.
- Botão play destacado.
- Velocidade.
- Avançar e voltar 10s.
- Tempo atual e duração.

### Transcrição

- Área legível.
- Botão editar.
- Busca dentro da transcrição.
- Copiar.
- Baixar TXT.
- Segmentar visualmente se houver timestamps.

### IA

O painel de IA deve ter forte identidade visual.

Elementos:

- Campo: "Pergunte algo sobre este áudio..."
- Botão: "Analisar"
- Cards de templates.
- Histórico de análises.
- Resultado formatado.

Usar ícone de sparkle ou cérebro/IA.

## 16. Templates

Tela de templates deve parecer uma galeria.

Categorias:

- Resumo.
- Comunicação.
- Pregação.
- Reunião.
- Conteúdo.
- Reflexão.

Cada template card:

- Nome.
- Descrição.
- Categoria.
- Ícone.
- Botão usar.

## 17. Estados Vazios

Criar empty states bonitos e úteis.

### Sem áudios

Título:

```txt
Você ainda não enviou nenhum áudio.
```

Texto:

```txt
Comece fazendo upload de uma gravação, áudio do WhatsApp, reunião, aula ou pregação.
```

CTA:

```txt
Enviar primeiro áudio
```

### Sem transcrição

Título:

```txt
Este áudio ainda não foi transcrito.
```

Texto:

```txt
Transcreva o áudio para pesquisar, resumir e fazer perguntas com IA.
```

CTA:

```txt
Transcrever agora
```

### Sem análises

Título:

```txt
Nenhuma análise gerada ainda.
```

Texto:

```txt
Use um template ou faça uma pergunta livre sobre a transcrição.
```

CTA:

```txt
Gerar análise
```

## 18. Microcopy

Tom de voz:

- Claro.
- Amigável.
- Direto.
- Profissional.
- Sem excesso de informalidade.

Exemplos:

```txt
Enviar áudio
Criar pasta
Transcrever agora
Analisar com IA
Pergunte algo sobre este áudio
Organizar em pasta
Copiar transcrição
Baixar TXT
```

Mensagens de sucesso:

```txt
Áudio enviado com sucesso.
Transcrição concluída.
Análise gerada com sucesso.
Pasta criada.
```

Mensagens de erro:

```txt
Não foi possível enviar este áudio.
Não foi possível concluir a transcrição.
Este arquivo não é suportado.
Você não tem permissão para acessar este áudio.
```

## 19. Acessibilidade

A interface deve seguir boas práticas:

- Contraste adequado.
- Estados de foco visíveis.
- Botões com labels claros.
- Ícones acompanhados de texto quando necessário.
- Navegação por teclado.
- Tamanhos de toque adequados no mobile.
- Não depender apenas de cor para comunicar status.

## 20. Animações

Usar animações sutis:

- Hover em cards.
- Transição de drawer/modal.
- Feedback de upload.
- Pulse leve em status de transcrição.
- Skeleton loading.

Evitar animações exageradas.

## 21. Telas que o Google Stitch Deve Gerar

Gerar telas para:

1. Landing page.
2. Login.
3. Cadastro.
4. Dashboard.
5. Biblioteca de áudios.
6. Modal/drawer de upload.
7. Tela de pasta.
8. Página de detalhe do áudio.
9. Painel de transcrição.
10. Painel de análise com IA.
11. Galeria de templates.
12. Tela de configurações.
13. Versão mobile do dashboard.
14. Versão mobile da página do áudio.

## 22. Prompt para Google Stitch

```txt
Design a modern responsive SaaS web application called MeusÁudios.

MeusÁudios is a web app where users upload audio files, organize them into folders, transcribe them automatically and analyze the transcript with AI.

The visual style should be warm, vibrant but comfortable, modern, clean and trustworthy. Use a light background (#F8FAFC), white cards, soft shadows, rounded corners (16-20px), strong spacing and a warm coordinated color palette built around burnt orange. The product should feel like a productivity platform mixed with an intelligent personal audio library.

Color palette:
- Primary (CTAs, links, focus): burnt orange #EA580C, dark #9A3412, light #FFEDD5
- Accent (AI highlights): rose #E11D48 with light tint #FFE4E6
- Info (audio waves, neutral info): amber gold #D97706 with light #FEF3C7
- Success (transcribed, done): green #10B981 (kept as complementary contrast)
- Warning (in-progress): yellow #CA8A04 with light #FEF9C3
- Error (destructive): red #DC2626

Gradient primary: linear-gradient(135deg, #EA580C 0%, #E11D48 55%, #D97706 100%) used in primary buttons, brand mark, audio cover.

Typography pairing: Fraunces (serif, italic for emphasis) for display/headings/wordmark "Meus*Áudios*"; Plus Jakarta Sans for body and UI; JetBrains Mono for timestamps and shortcuts. Avoid Inter.

Create responsive screens for desktop and mobile.

Main screens:
- Landing page (hero with title "Seus áudios organizados, transcritos e inteligentes." mockup, how-it-works 3 steps, use cases)
- Login / Register
- Dashboard (greeting, 4 metric cards, recent audios, recent folders, recommended templates)
- Audio library with folder sidebar (grid/list toggle, filter tabs)
- Upload modal/drawer (dropzone, file list, folder, language, content type, tags)
- Audio detail page (cover, breadcrumb, player with waveform, transcript with timestamps, AI panel with question box + template cards + history, notes by timestamp)
- Templates gallery (cards by category)
- Settings (profile, preferences, usage)

Authenticated shell: left sidebar with MeusÁudios logo (gradient mark with audio waveform icon), upload CTA button (gradient), main navigation, folder tree with colored swatches and counters, plan footer with progress bar. Topbar with breadcrumb, global search input with ⌘K, notification + settings icons, user avatar with gradient.

The audio detail page should be the most polished screen.

Use Portuguese (pt-BR) labels in the UI. Keep the interface elegant, readable and pleasant for long sessions.
```
