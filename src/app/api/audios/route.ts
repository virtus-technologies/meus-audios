import { NextResponse } from "next/server";
import type { AudioStatus } from "@prisma/client";

import { requireUserApi } from "@/lib/auth";
import { apiError } from "@/lib/api-error";
import { listAudios } from "@/services/audio-service";

export async function GET(request: Request) {
  try {
    const user = await requireUserApi();
    const url = new URL(request.url);
    const folderId = url.searchParams.get("folderId");
    const status = url.searchParams.get("status") as AudioStatus | null;
    const limit = Number(url.searchParams.get("limit") ?? 50);
    const offset = Number(url.searchParams.get("offset") ?? 0);

    const audios = await listAudios({
      userId: user.id,
      folderId: folderId === null ? undefined : folderId === "null" ? null : folderId,
      status: status ?? undefined,
      limit: Math.min(Math.max(limit, 1), 200),
      offset: Math.max(offset, 0),
    });

    return NextResponse.json({ audios });
  } catch (error) {
    return apiError(error);
  }
}
