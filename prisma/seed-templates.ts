import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type SystemTemplate = {
  name: string;
  description: string;
  category: string;
  prompt: string;
};

// Templates literais conforme docs/plano-de-negocios.md seção 8.11
const SYSTEM_TEMPLATES: ReadonlyArray<SystemTemplate> = [
  {
    name: "Resumo básico",
    description: "Resumo em até 10 tópicos com ideias principais, exemplos e conclusões.",
    category: "Resumo",
    prompt:
      "Gere um resumo claro e objetivo deste áudio em até 10 tópicos. Destaque as ideias principais, exemplos importantes e conclusões.",
  },
  {
    name: "Resumo executivo",
    description: "Contexto, principais pontos, decisões e próximas ações.",
    category: "Resumo",
    prompt:
      "Gere um resumo executivo deste áudio. Inclua contexto, principais pontos, decisões ou conclusões e próximas ações.",
  },
  {
    name: "Palavras mais repetidas",
    description: "Top 10 palavras com contagem aproximada e contexto.",
    category: "Estudo",
    prompt:
      "Analise a transcrição e liste as 10 palavras mais repetidas, ignorando artigos, preposições e palavras muito comuns. Para cada palavra, informe a quantidade aproximada de ocorrências e o possível significado dentro do contexto.",
  },
  {
    name: "Expressões mais usadas",
    description: "Padrões de linguagem que se repetem e o que revelam.",
    category: "Estudo",
    prompt:
      "Identifique expressões, frases ou padrões de linguagem que aparecem repetidamente neste áudio. Explique o que isso revela sobre o estilo de comunicação do orador.",
  },
  {
    name: "Clareza da comunicação",
    description: "Nota de 0 a 10 para clareza com justificativa.",
    category: "Comunicação",
    prompt:
      "Avalie a clareza da comunicação neste áudio considerando organização das ideias, uso de exemplos, repetições excessivas, frases confusas e progressão lógica. Dê uma nota de 0 a 10 e explique.",
  },
  {
    name: "Engajamento do discurso",
    description: "Nota de 0 a 10 para engajamento com sugestões.",
    category: "Discurso",
    prompt:
      "Avalie o nível de engajamento deste áudio considerando novos fatos apresentados, histórias ou exemplos usados, perguntas feitas à audiência, perguntas reflexivas, momentos de conexão emocional e chamadas para ação. Dê uma nota de 0 a 10 e sugira melhorias.",
  },
  {
    name: "Análise de pregação",
    description: "Tema, texto bíblico, estrutura, aplicação prática e melhorias.",
    category: "Pregação",
    prompt:
      "Analise esta pregação considerando tema central, texto bíblico principal, estrutura da mensagem, aplicação prática, clareza espiritual, uso de exemplos, chamado à reflexão, chamado à ação, pontos fortes e pontos que poderiam ser melhorados.",
  },
  {
    name: "Análise de discurso",
    description: "Objetivo, tese, argumentos e melhorias.",
    category: "Discurso",
    prompt:
      "Analise este discurso considerando objetivo principal, público-alvo provável, tese defendida, argumentos usados, evidências apresentadas, ritmo da fala, clareza, persuasão, fechamento e melhorias sugeridas.",
  },
  {
    name: "Análise de reunião",
    description: "Participantes, decisões, pendências e próximos passos.",
    category: "Reunião",
    prompt:
      "Analise esta reunião e extraia participantes mencionados, assuntos discutidos, decisões tomadas, pendências, responsáveis, prazos mencionados, riscos ou bloqueios e próximos passos.",
  },
  {
    name: "Criação de conteúdo",
    description: "Posts para redes, roteiro de vídeo, frases de impacto.",
    category: "Conteúdo social",
    prompt:
      "Transforme este áudio em conteúdos reutilizáveis: post para LinkedIn, post para Instagram, roteiro curto para vídeo, título chamativo, descrição curta e cinco frases de impacto.",
  },
  {
    name: "Análise de evolução pessoal",
    description: "Emoções, preocupações, próximos passos e perguntas reflexivas.",
    category: "Reflexão pessoal",
    prompt:
      "Analise este áudio como uma reflexão pessoal. Identifique emoções predominantes, preocupações, ideias recorrentes, decisões implícitas, possíveis próximos passos e perguntas que o usuário deveria se fazer.",
  },
];

async function main() {
  for (const template of SYSTEM_TEMPLATES) {
    const existing = await prisma.analysisTemplate.findFirst({
      where: { name: template.name, isSystem: true },
      select: { id: true },
    });

    if (existing) {
      await prisma.analysisTemplate.update({
        where: { id: existing.id },
        data: {
          description: template.description,
          category: template.category,
          prompt: template.prompt,
        },
      });
    } else {
      await prisma.analysisTemplate.create({
        data: {
          name: template.name,
          description: template.description,
          category: template.category,
          prompt: template.prompt,
          isSystem: true,
        },
      });
    }
  }

  console.log(`✔ ${SYSTEM_TEMPLATES.length} templates do sistema seedados.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
