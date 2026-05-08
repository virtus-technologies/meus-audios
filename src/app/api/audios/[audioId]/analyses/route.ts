import { NextResponse } from "next/server";

import { requireUserApi } from "@/lib/auth";
import { apiError } from "@/lib/api-error";
import { createAnalysisSchema } from "@/lib/validations";
import { createAnalysis, listAnalyses } from "@/services/analysis-service";

type Params = { params: Promise<{ audioId: string }> };

export const maxDuration = 300;

export async function GET(_request: Request, { params }: Params) {
  try {
    const user = await requireUserApi();
    const { audioId } = await params;
    const analyses = await listAnalyses({ userId: user.id, audioId });
    return NextResponse.json({ analyses });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const user = await requireUserApi();
    const { audioId } = await params;
    const body = await request.json();
    const parsed = createAnalysisSchema.parse(body);

    const analysis = await createAnalysis({
      userId: user.id,
      audioId,
      question: parsed.question ?? null,
      templateId: parsed.templateId ?? null,
    });

    return NextResponse.json({ analysis }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
