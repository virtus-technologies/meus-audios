import { NextResponse } from "next/server";
import { Readable } from "node:stream";

import { requireUserApi } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isLocalStorageBackend, StorageError } from "@/lib/storage";
import { openLocalAudio } from "@/lib/storage/local";

/**
 * Servidor estático apenas em dev local (`APP_ENV=local`). Em preview/prod
 * o storage é Vercel Blob, que serve diretamente — esta rota retorna 404
 * nesse caso para não vazar informação sobre layout interno.
 *
 * Permissão: o storageKey tem o formato `users/{userId}/audios/{audioId}/...`
 * e validamos que o usuário autenticado é dono do `Audio` correspondente.
 *
 * Range requests são suportados para permitir seek no `<audio>` (e em
 * arquivos grandes evita carregar tudo).
 */

export const runtime = "nodejs";

const MIME_BY_EXT: Record<string, string> = {
  mp3: "audio/mpeg",
  m4a: "audio/mp4",
  wav: "audio/wav",
  ogg: "audio/ogg",
  webm: "audio/webm",
  mp4: "video/mp4",
};

export async function GET(
  request: Request,
  context: { params: Promise<{ key: string[] }> },
) {
  if (!isLocalStorageBackend()) {
    return new NextResponse("Not found", { status: 404 });
  }

  const { key } = await context.params;
  const storageKey = key.join("/");

  let user;
  try {
    user = await requireUserApi();
  } catch {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const audio = await prisma.audio.findUnique({
    where: { storageKey },
    select: { id: true, userId: true, mimeType: true, sizeBytes: true },
  });
  if (!audio || audio.userId !== user.id) {
    return new NextResponse("Not found", { status: 404 });
  }

  let handle;
  try {
    handle = openLocalAudio(storageKey);
  } catch (error) {
    if (error instanceof StorageError && error.code === "NOT_FOUND") {
      return new NextResponse("Not found", { status: 404 });
    }
    throw error;
  }

  const ext = storageKey.split(".").pop()?.toLowerCase() ?? "";
  const contentType = audio.mimeType || MIME_BY_EXT[ext] || "application/octet-stream";

  const range = request.headers.get("range");
  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match) {
      return new NextResponse("Invalid Range", { status: 416 });
    }
    const startStr = match[1];
    const endStr = match[2];
    const start = startStr === "" ? handle.size - Number(endStr) : Number(startStr);
    const end = endStr === "" ? handle.size - 1 : Number(endStr);
    if (
      Number.isNaN(start) ||
      Number.isNaN(end) ||
      start < 0 ||
      end >= handle.size ||
      start > end
    ) {
      return new NextResponse("Invalid Range", {
        status: 416,
        headers: { "Content-Range": `bytes */${handle.size}` },
      });
    }
    const stream = Readable.toWeb(
      handle.stream(start, end) as Readable,
    ) as ReadableStream<Uint8Array>;
    return new NextResponse(stream, {
      status: 206,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(end - start + 1),
        "Content-Range": `bytes ${start}-${end}/${handle.size}`,
        "Accept-Ranges": "bytes",
        "Cache-Control": "private, max-age=300",
      },
    });
  }

  const stream = Readable.toWeb(handle.stream() as Readable) as ReadableStream<Uint8Array>;
  return new NextResponse(stream, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(handle.size),
      "Accept-Ranges": "bytes",
      "Cache-Control": "private, max-age=300",
    },
  });
}
