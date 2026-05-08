import { NextResponse } from "next/server";

import { requireUserApi } from "@/lib/auth";
import { apiError } from "@/lib/api-error";
import { transcribeAudio } from "@/services/transcription-service";

type Params = { params: Promise<{ audioId: string }> };

// Tempo máximo (em segundos) para a serverless function. Whisper pode
// demorar alguns minutos para áudios longos.
export const maxDuration = 300;

export async function POST(_request: Request, { params }: Params) {
  try {
    const user = await requireUserApi();
    const { audioId } = await params;
    const transcript = await transcribeAudio({ audioId, userId: user.id });
    return NextResponse.json({ transcript });
  } catch (error) {
    return apiError(error);
  }
}
