import { NextRequest, NextResponse } from "next/server";
import type { Order } from "@/lib/store";
import { readOrders, writeOrders } from "@/lib/serverData";

export async function GET() {
  const orders = await readOrders();
  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  try {
    const order = (await req.json()) as unknown;
    if (!order || typeof order !== "object" || Array.isArray(order)) {
      return NextResponse.json({ error: "Invalid order payload" }, { status: 400 });
    }

    const { id, customer, email, phone, address, city, country, items, total, paymentMethod, status, date } = order as Record<string, unknown>;
    if (
      typeof id !== "string" ||
      typeof customer !== "string" ||
      typeof email !== "string" ||
      typeof phone !== "string" ||
      typeof address !== "string" ||
      typeof city !== "string" ||
      typeof country !== "string" ||
      typeof items !== "number" ||
      typeof total !== "number" ||
      typeof paymentMethod !== "string" ||
      typeof status !== "string" ||
      typeof date !== "string"
    ) {
      return NextResponse.json({ error: "Missing or invalid order fields" }, { status: 400 });
    }

    const existing = await readOrders();
    const typedOrder = order as Order;
    const next = [typedOrder, ...existing];
    await writeOrders(next);
    return NextResponse.json({ ok: true, order: typedOrder });
  } catch {
    return NextResponse.json({ error: "Unable to save order" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const payload = (await req.json()) as { id: string; status?: string; paymentCleared?: boolean };
    if (!payload?.id) {
      return NextResponse.json({ error: "Order id is required" }, { status: 400 });
    }

    const orders = await readOrders();
    const next = orders.map((order) => {
      if (order.id !== payload.id) return order;
      return {
        ...order,
        ...(payload.status !== undefined ? { status: payload.status } : {}),
        ...(payload.paymentCleared !== undefined ? { paymentCleared: payload.paymentCleared } : {}),
      };
    });

    await writeOrders(next);
    return NextResponse.json({ ok: true, orders: next });
  } catch {
    return NextResponse.json({ error: "Unable to update order" }, { status: 500 });
  }
}
