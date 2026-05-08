import { NextResponse } from "next/server";

import { requireUserApi } from "@/lib/auth";
import { apiError } from "@/lib/api-error";
import { toggleFavoriteSchema } from "@/lib/validations";
import { setAudioFavorite } from "@/services/audio-service";

type Params = { params: Promise<{ audioId: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    const user = await requireUserApi();
    const { audioId } = await params;
    const body = (await request.json().catch(() => ({}))) as unknown;
    const parsed = toggleFavoriteSchema.parse(body ?? {});
    const audio = await setAudioFavorite({
      userId: user.id,
      audioId,
      isFavorite: parsed.isFavorite,
    });
    return NextResponse.json({ audio });
  } catch (error) {
    return apiError(error);
  }
}
