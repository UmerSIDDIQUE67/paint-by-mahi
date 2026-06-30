import fs from "fs/promises";
import path from "path";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/lib/defaultSettings";
import { ARTWORKS, type Artwork } from "@/lib/data";
import type { ActiveUser } from "@/lib/store";
import type { Order } from "@/lib/store";

const DATA_DIR = process.env.VERCEL
  ? path.join("/tmp", "paint-by-mahi-data")
  : path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
const ARTWORKS_FILE = path.join(DATA_DIR, "artworks.json");
const ACTIVE_USERS_FILE = path.join(DATA_DIR, "active-sessions.json");

async function ensureDataDir(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // ignore
  }
}

async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  try {
    await ensureDataDir();
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(filePath: string, data: T): Promise<void> {
  try {
    await ensureDataDir();
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch {
    // ignore write failures in development
  }
}

export async function readOrders(): Promise<Order[]> {
  return readJson<Order[]>(ORDERS_FILE, []);
}

export async function writeOrders(orders: Order[]): Promise<void> {
  return writeJson(ORDERS_FILE, orders);
}

export async function readSettings(): Promise<SiteSettings> {
  return readJson<SiteSettings>(SETTINGS_FILE, DEFAULT_SETTINGS);
}

export async function writeSettings(settings: SiteSettings): Promise<void> {
  return writeJson(SETTINGS_FILE, settings);
}

export async function readArtworks(): Promise<Artwork[]> {
  return readJson<Artwork[]>(ARTWORKS_FILE, ARTWORKS);
}

export async function writeArtworks(artworks: Artwork[]): Promise<void> {
  return writeJson(ARTWORKS_FILE, artworks);
}

export async function readActiveUsers(): Promise<ActiveUser[]> {
  return readJson<ActiveUser[]>(ACTIVE_USERS_FILE, []);
}

export async function writeActiveUsers(activeUsers: ActiveUser[]): Promise<void> {
  return writeJson(ACTIVE_USERS_FILE, activeUsers);
}
