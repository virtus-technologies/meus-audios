import { NextResponse } from "next/server";

import { requireUserApi } from "@/lib/auth";
import { apiError } from "@/lib/api-error";
import { searchAll } from "@/services/search-service";

export async function GET(request: Request) {
  try {
    const user = await requireUserApi();
    const url = new URL(request.url);
    const query = url.searchParams.get("q") ?? "";
    const results = await searchAll({ userId: user.id, query });
    return NextResponse.json(results);
  } catch (error) {
    return apiError(error);
  }
}
