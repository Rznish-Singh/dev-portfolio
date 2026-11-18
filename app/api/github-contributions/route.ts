import { NextResponse } from "next/server";
import { getCachedContributions } from "@/lib/get-cached-contributions";
import { USER } from "@/config/user";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getCachedContributions(USER.github.username);
  return NextResponse.json(data);
}