export const ANALYSIS_SYSTEM_PROMPT = `Você é um assistente especializado em analisar transcrições de áudio.
Use exclusivamente a transcrição fornecida como fonte principal.
Quando algo não estiver claro na transcrição, diga que não é possível concluir com segurança.
Responda em português do Brasil, com linguagem clara, objetiva e organizada.`;

export function buildFreeQuestionPrompt(params: { transcript: string; question: string }): string {
  return `Contexto:
Você está analisando a transcrição de um áudio do usuário.

Transcrição:
${params.transcript}

Pergunta do usuário:
${params.question}

Responda de forma clara, estruturada e útil.`;
}

export function buildTemplatePrompt(params: {
  transcript: string;
  templatePrompt: string;
}): string {
  return `Contexto:
Você está analisando a transcrição de um áudio do usuário.

Transcrição:
${params.transcript}

Tarefa:
${params.templatePrompt}

Responda em português do Brasil.
Organize a resposta com títulos, tópicos e recomendações práticas quando fizer sentido.`;
}
