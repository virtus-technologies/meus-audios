import { NextResponse } from "next/server";

import { requireUserApi } from "@/lib/auth";
import { apiError } from "@/lib/api-error";
import { updateNoteSchema } from "@/lib/validations";
import { deleteNote, updateNote } from "@/services/note-service";

type Params = { params: Promise<{ audioId: string; noteId: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    const user = await requireUserApi();
    const { noteId } = await params;
    const body = await request.json();
    const parsed = updateNoteSchema.parse(body);
    const note = await updateNote({ userId: user.id, noteId, text: parsed.text });
    return NextResponse.json({ note });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const user = await requireUserApi();
    const { noteId } = await params;
    await deleteNote({ userId: user.id, noteId });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
