import { NextResponse } from "next/server";

import { requireUserApi } from "@/lib/auth";
import { apiError } from "@/lib/api-error";
import { createNoteSchema } from "@/lib/validations";
import { createNote, listNotes } from "@/services/note-service";

type Params = { params: Promise<{ audioId: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const user = await requireUserApi();
    const { audioId } = await params;
    const notes = await listNotes({ userId: user.id, audioId });
    return NextResponse.json({ notes });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const user = await requireUserApi();
    const { audioId } = await params;
    const body = await request.json();
    const parsed = createNoteSchema.parse(body);
    const note = await createNote({
      userId: user.id,
      audioId,
      timestampSeconds: parsed.timestampSeconds,
      text: parsed.text,
    });
    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
