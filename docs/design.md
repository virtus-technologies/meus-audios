# MeusÁudios — Design Guidelines para Google Stitch

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

Usar uma paleta vibrante, porém confortável.

### Cores principais sugeridas

#### Azul violeta

Usar como cor primária para botões, links, foco e elementos de ação.

```txt
Primary: #4F46E5
Primary dark: #3730A3
Primary light: #EEF2FF
```

#### Roxo moderno

Usar em destaques de IA, cards especiais e gradientes.

```txt
Purple: #7C3AED
Purple light: #F3E8FF
```

#### Ciano / azul claro

Usar para elementos de áudio, ondas sonoras, estados informativos e detalhes visuais.

```txt
Cyan: #06B6D4
Cyan light: #ECFEFF
```

#### Verde energético

Usar para estados positivos, sucesso, transcrição concluída e confirmações.

```txt
Success: #10B981
Success light: #ECFDF5
```

#### Laranja suave

Usar para alertas leves, pendências e status em processamento.

```txt
Warning: #F59E0B
Warning light: #FFFBEB
```

#### Vermelho suave

Usar somente para erros e ações destrutivas.

```txt
Error: #EF4444
Error light: #FEF2F2
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

Usar gradientes com moderação para dar personalidade ao produto.

Exemplos:

```txt
Gradient primary: linear-gradient(135deg, #4F46E5 0%, #7C3AED 55%, #06B6D4 100%)
Gradient soft: linear-gradient(135deg, #EEF2FF 0%, #F3E8FF 50%, #ECFEFF 100%)
```

Aplicar gradientes em:

- Hero da landing page.
- Cards de destaque.
- Botão principal, se visualmente equilibrado.
- Área de IA/análise.
- Ilustrações de waveform.

Evitar gradiente em tudo. A maior parte da interface deve permanecer clara e legível.

## 6. Tipografia

Usar fonte moderna, limpa e altamente legível.

Sugestões:

- Inter.
- Geist Sans.
- Manrope.
- Plus Jakarta Sans.

Hierarquia sugerida:

```txt
H1: 40px a 56px, bold, line-height confortável
H2: 28px a 36px, semibold/bold
H3: 22px a 28px, semibold
Body: 16px
Small: 14px
Caption: 12px
```

A interface deve ter boa densidade, mas sem ficar apertada.

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

Exemplos:

```txt
Transcrito: badge verde
Transcrevendo: badge laranja
Erro: badge vermelho
Upload feito: badge azul
IA: badge roxo
```

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

The visual style should be vibrant but comfortable, modern, clean and trustworthy. Use a light background, white cards, soft shadows, rounded corners, strong spacing and a color palette based on indigo, violet, cyan and soft green. The product should feel like a productivity platform mixed with an intelligent personal audio library.

Create responsive screens for desktop and mobile.

Main screens:
- Landing page
- Login
- Dashboard
- Audio library with folder sidebar
- Upload modal or drawer
- Audio detail page with player, transcript and AI analysis panel
- Templates gallery
- Settings page

The authenticated app should have a left sidebar with the MeusÁudios logo, main navigation and folder tree. It should have a topbar with breadcrumbs, global search, upload button and user avatar.

The audio detail page should be the most polished screen. It needs an audio player with waveform/progress bar, playback controls, speed control, metadata, tags, transcript viewer/editor, timestamp notes, AI question input, analysis template cards and analysis history.

Use Portuguese labels in the UI. Keep the interface elegant, readable and pleasant for long sessions.
```
