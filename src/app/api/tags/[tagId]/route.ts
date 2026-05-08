import { NextResponse } from "next/server";

import { requireUserApi } from "@/lib/auth";
import { apiError } from "@/lib/api-error";
import { renameTagSchema } from "@/lib/validations";
import { deleteTag, renameTag } from "@/services/tag-service";

type Params = { params: Promise<{ tagId: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    const user = await requireUserApi();
    const { tagId } = await params;
    const body = await request.json();
    const parsed = renameTagSchema.parse(body);
    const tag = await renameTag({ userId: user.id, tagId, name: parsed.name });
    return NextResponse.json({ tag });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const user = await requireUserApi();
    const { tagId } = await params;
    await deleteTag({ userId: user.id, tagId });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
