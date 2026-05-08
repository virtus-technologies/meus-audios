import { NextResponse } from "next/server";
import { z } from "zod";

import { requireUserApi } from "@/lib/auth";
import { apiError } from "@/lib/api-error";
import { idSchema } from "@/lib/validations";
import { attachTag } from "@/services/tag-service";

type Params = { params: Promise<{ audioId: string }> };

const bodySchema = z.object({ tagId: idSchema });

export async function POST(request: Request, { params }: Params) {
  try {
    const user = await requireUserApi();
    const { audioId } = await params;
    const body = await request.json();
    const parsed = bodySchema.parse(body);
    await attachTag({ userId: user.id, audioId, tagId: parsed.tagId });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
