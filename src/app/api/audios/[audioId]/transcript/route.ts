import { NextResponse } from "next/server";
import { z } from "zod";

import { requireUserApi } from "@/lib/auth";
import { apiError } from "@/lib/api-error";
import { getTranscript, updateTranscript } from "@/services/transcription-service";

type Params = { params: Promise<{ audioId: string }> };

const updateSchema = z.object({
  fullText: z.string().min(1).max(200_000),
});

export async function GET(_request: Request, { params }: Params) {
  try {
    const user = await requireUserApi();
    const { audioId } = await params;
    const transcript = await getTranscript(audioId, user.id);
    if (!transcript) {
      return NextResponse.json({ transcript: null }, { status: 404 });
    }
    return NextResponse.json({ transcript });
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const user = await requireUserApi();
    const { audioId } = await params;
    const body = await request.json();
    const parsed = updateSchema.parse(body);
    const transcript = await updateTranscript({
      audioId,
      userId: user.id,
      fullText: parsed.fullText,
    });
    return NextResponse.json({ transcript });
  } catch (error) {
    return apiError(error);
  }
}
