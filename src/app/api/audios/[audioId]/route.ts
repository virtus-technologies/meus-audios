import { NextResponse } from "next/server";

import { requireUserApi } from "@/lib/auth";
import { apiError } from "@/lib/api-error";
import { updateAudioSchema } from "@/lib/validations";
import { deleteAudio, getAudioById, updateAudio } from "@/services/audio-service";

type Params = { params: Promise<{ audioId: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const user = await requireUserApi();
    const { audioId } = await params;
    const audio = await getAudioById(audioId, user.id);
    return NextResponse.json({ audio });
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const user = await requireUserApi();
    const { audioId } = await params;
    const body = await request.json();
    const parsed = updateAudioSchema.parse(body);
    const audio = await updateAudio({ userId: user.id, audioId, data: parsed });
    return NextResponse.json({ audio });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const user = await requireUserApi();
    const { audioId } = await params;
    await deleteAudio({ userId: user.id, audioId });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
