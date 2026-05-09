import { NextResponse } from "next/server";

import { requireUserApi } from "@/lib/auth";
import { apiError } from "@/lib/api-error";
import { audioPeaksSchema } from "@/lib/validations";
import { setAudioPeaks } from "@/services/audio-service";

type Params = { params: Promise<{ audioId: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    const user = await requireUserApi();
    const { audioId } = await params;
    const body = await request.json();
    const parsed = audioPeaksSchema.parse(body);
    const audio = await setAudioPeaks({
      userId: user.id,
      audioId,
      peaks: parsed.peaks,
    });
    return NextResponse.json({ audio });
  } catch (error) {
    return apiError(error);
  }
}
