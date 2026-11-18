import { NextResponse } from "next/server";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;
const KEY = "imgopt:visits";

async function redis(cmd: string) {
  if (!url || !token) return null;
  const r = await fetch(`${url}/${cmd}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  return (await r.json()).result as number | null;
}

export async function GET() {
  return NextResponse.json({ count: Number((await redis(`get/${KEY}`)) ?? 0) });
}
export async function POST() {
  return NextResponse.json({ count: Number((await redis(`incr/${KEY}`)) ?? 0) });
}
