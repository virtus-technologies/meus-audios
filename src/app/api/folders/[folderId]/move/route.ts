import { NextResponse } from "next/server";

import { requireUserApi } from "@/lib/auth";
import { apiError } from "@/lib/api-error";
import { moveFolderSchema } from "@/lib/validations";
import { moveFolder } from "@/services/folder-service";

type Params = { params: Promise<{ folderId: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const user = await requireUserApi();
    const { folderId } = await params;
    const body = await request.json();
    const parsed = moveFolderSchema.parse(body);

    const folder = await moveFolder({
      userId: user.id,
      folderId,
      parentId: parsed.parentId,
    });

    return NextResponse.json({ folder });
  } catch (error) {
    return apiError(error);
  }
}
