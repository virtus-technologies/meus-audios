import { NextResponse } from "next/server";

import { requireUserApi } from "@/lib/auth";
import { apiError } from "@/lib/api-error";
import { createTagSchema } from "@/lib/validations";
import { createTag, listTags } from "@/services/tag-service";

export async function GET() {
  try {
    const user = await requireUserApi();
    const tags = await listTags(user.id);
    return NextResponse.json({ tags });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUserApi();
    const body = await request.json();
    const parsed = createTagSchema.parse(body);
    const tag = await createTag({ userId: user.id, name: parsed.name });
    return NextResponse.json({ tag }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
