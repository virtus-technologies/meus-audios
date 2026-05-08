import { NextResponse } from "next/server";

import { requireUserApi } from "@/lib/auth";
import { apiError } from "@/lib/api-error";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const user = await requireUserApi();
    const templates = await prisma.analysisTemplate.findMany({
      where: {
        OR: [{ isSystem: true }, { userId: user.id }],
      },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });
    return NextResponse.json({ templates });
  } catch (error) {
    return apiError(error);
  }
}
