import { NextRequest, NextResponse } from "next/server";
import type { Artwork } from "@/lib/data";
import { readArtworks, writeArtworks } from "@/lib/serverData";

export async function GET() {
  const artworks = await readArtworks();
  return NextResponse.json({ artworks });
}

export async function POST(req: NextRequest) {
  try {
    const artwork = (await req.json()) as Artwork;
    if (!artwork || typeof artwork !== "object" || Array.isArray(artwork)) {
      return NextResponse.json({ error: "Invalid artwork payload" }, { status: 400 });
    }

    const existing = await readArtworks();
    const next = [artwork, ...existing];
    await writeArtworks(next);
    return NextResponse.json({ ok: true, artwork });
  } catch {
    return NextResponse.json({ error: "Unable to save artwork" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const payload = (await req.json()) as Artwork;
    if (!payload || typeof payload !== "object" || Array.isArray(payload) || typeof payload.id !== "string") {
      return NextResponse.json({ error: "Invalid artwork payload" }, { status: 400 });
    }

    const artworks = await readArtworks();
    const next = artworks.map((item) => (item.id === payload.id ? payload : item));
    await writeArtworks(next);
    return NextResponse.json({ ok: true, artworks: next });
  } catch {
    return NextResponse.json({ error: "Unable to update artwork" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Artwork id is required" }, { status: 400 });
    }

    const artworks = await readArtworks();
    const next = artworks.filter((item) => item.id !== id);
    await writeArtworks(next);
    return NextResponse.json({ ok: true, artworks: next });
  } catch {
    return NextResponse.json({ error: "Unable to delete artwork" }, { status: 500 });
  }
}
