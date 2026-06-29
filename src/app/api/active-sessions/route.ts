import { NextRequest, NextResponse } from "next/server";
import { readActiveUsers, writeActiveUsers } from "@/lib/serverData";

export async function GET() {
  const activeUsers = await readActiveUsers();
  return NextResponse.json(activeUsers);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { name: string; email: string };
    if (!body.name || !body.email) {
      return NextResponse.json({ error: "Missing name or email" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const existing = await readActiveUsers();
    const next = existing.map((session) =>
      session.email.toLowerCase() === body.email.toLowerCase()
        ? { ...session, lastSeenAt: now }
        : session
    );

    const updated = next.some((session) => session.email.toLowerCase() === body.email.toLowerCase())
      ? next
      : [...next, { name: body.name, email: body.email.toLowerCase(), loginAt: now, lastSeenAt: now }];

    await writeActiveUsers(updated);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[ActiveSessions] POST error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const existing = await readActiveUsers();
    const filtered = existing.filter((session) => session.email.toLowerCase() !== email.toLowerCase());
    await writeActiveUsers(filtered);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[ActiveSessions] DELETE error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
