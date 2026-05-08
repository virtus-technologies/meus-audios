import { NextResponse } from "next/server";

import { requireUserApi } from "@/lib/auth";
import { apiError } from "@/lib/api-error";
import { renameFolderSchema } from "@/lib/validations";
import { deleteFolder, getFolderById, renameFolder } from "@/services/folder-service";

type Params = { params: Promise<{ folderId: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const user = await requireUserApi();
    const { folderId } = await params;
    const folder = await getFolderById(folderId, user.id);
    return NextResponse.json({ folder });
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const user = await requireUserApi();
    const { folderId } = await params;
    const body = await request.json();
    const parsed = renameFolderSchema.parse(body);

    const folder = await renameFolder({ userId: user.id, folderId, name: parsed.name });
    return NextResponse.json({ folder });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const user = await requireUserApi();
    const { folderId } = await params;
    await deleteFolder({ userId: user.id, folderId });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
