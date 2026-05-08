import { NextResponse } from "next/server";

import { requireUserApi } from "@/lib/auth";
import { apiError } from "@/lib/api-error";
import { detachTag } from "@/services/tag-service";

type Params = { params: Promise<{ audioId: string; tagId: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const user = await requireUserApi();
    const { audioId, tagId } = await params;
    await detachTag({ userId: user.id, audioId, tagId });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
