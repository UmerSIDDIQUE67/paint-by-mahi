import { NextRequest, NextResponse } from "next/server";
import { readSettings, writeSettings } from "@/lib/serverData";
import { DEFAULT_SETTINGS } from "@/lib/defaultSettings";

export async function GET() {
  const settings = await readSettings();
  return NextResponse.json({ settings: { ...DEFAULT_SETTINGS, ...settings } });
}

export async function PUT(req: NextRequest) {
  try {
    const payload = (await req.json()) as Record<string, unknown>;
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return NextResponse.json({ error: "Invalid settings payload" }, { status: 400 });
    }

    const current = await readSettings();
    const next = { ...current, ...payload };
    await writeSettings(next);
    return NextResponse.json({ ok: true, settings: next });
  } catch {
    return NextResponse.json({ error: "Unable to save settings" }, { status: 500 });
  }
}
