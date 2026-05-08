import { NextResponse } from "next/server";

import { requireUserApi } from "@/lib/auth";
import { apiError } from "@/lib/api-error";
import { deleteAnalysis } from "@/services/analysis-service";

type Params = { params: Promise<{ audioId: string; analysisId: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const user = await requireUserApi();
    const { analysisId } = await params;
    await deleteAnalysis({ userId: user.id, analysisId });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
