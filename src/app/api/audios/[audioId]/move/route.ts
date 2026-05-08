import { NextResponse } from "next/server";

import { requireUserApi } from "@/lib/auth";
import { apiError } from "@/lib/api-error";
import { moveAudioSchema } from "@/lib/validations";
import { moveAudio } from "@/services/audio-service";

type Params = { params: Promise<{ audioId: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const user = await requireUserApi();
    const { audioId } = await params;
    const body = await request.json();
    const parsed = moveAudioSchema.parse(body);
    const audio = await moveAudio({ userId: user.id, audioId, folderId: parsed.folderId });
    return NextResponse.json({ audio });
  } catch (error) {
    return apiError(error);
  }
}
