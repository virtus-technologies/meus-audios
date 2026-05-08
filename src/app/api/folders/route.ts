import { NextResponse } from "next/server";

import { requireUserApi } from "@/lib/auth";
import { apiError } from "@/lib/api-error";
import { createFolderSchema } from "@/lib/validations";
import { buildFolderTree, createFolder } from "@/services/folder-service";

export async function GET() {
  try {
    const user = await requireUserApi();
    const tree = await buildFolderTree(user.id);
    return NextResponse.json({ folders: tree });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUserApi();
    const body = await request.json();
    const parsed = createFolderSchema.parse(body);

    const folder = await createFolder({
      userId: user.id,
      name: parsed.name,
      parentId: parsed.parentId ?? null,
    });

    return NextResponse.json({ folder }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
