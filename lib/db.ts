import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { MATERIALS, type ColorSeed } from "./fabric-data";
import { stylesForFamily } from "./color-science";
import { DEFAULT_PRICING, type PricingSettings } from "./quote";

type DatabaseSyncLike = {
  exec(sql: string): void;
  prepare(sql: string): {
    all(...params: unknown[]): Record<string, unknown>[];
    get(...params: unknown[]): Record<string, unknown> | undefined;
    run(...params: unknown[]): { lastInsertRowid: number | bigint; changes: number };
  };
};

const DATA_DIR = process.env.LENA_DATA_DIR || path.join(process.cwd(), "data");
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

function loadSqlite(): { DatabaseSync: new (p: string) => DatabaseSyncLike } {
  const anyProc = process as unknown as {
    getBuiltinModule?: (id: string) => unknown;
  };
  if (typeof anyProc.getBuiltinModule === "function") {
    const mod = anyProc.getBuiltinModule("node:sqlite") as
      | { DatabaseSync: new (p: string) => DatabaseSyncLike }
      | undefined;
    if (mod?.DatabaseSync) return mod;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const req = eval("require") as (id: string) => any;
  return req("node:sqlite");
}

const globalForDb = globalThis as unknown as { __lenaDb?: DatabaseSyncLike };

export function getDb(): DatabaseSyncLike {
  if (globalForDb.__lenaDb) return globalForDb.__lenaDb;
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const { DatabaseSync } = loadSqlite();
  const db = new DatabaseSync(path.join(DATA_DIR, "lena.db"));
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");
  migrate(db);
  seed(db);
  globalForDb.__lenaDb = db;
  return db;
}

function migrate(db: DatabaseSyncLike) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS materials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      name_en TEXT,
      price_per_meter INTEGER,
      fabric_width INTEGER NOT NULL DEFAULT 280,
      description TEXT,
      fabric TEXT NOT NULL DEFAULT 'drape',
      weight TEXT,
      opacity REAL DEFAULT 0.9,
      sheen REAL DEFAULT 0.2,
      availability TEXT NOT NULL DEFAULT 'available',
      texture_image TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS colors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      material_id INTEGER NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
      code TEXT NOT NULL,
      name TEXT,
      hex TEXT,
      hex_source TEXT NOT NULL DEFAULT 'none',
      family TEXT,
      style_tags TEXT,
      swatch_image TEXT,
      availability TEXT NOT NULL DEFAULT 'available',
      sort_order INTEGER DEFAULT 0,
      UNIQUE(material_id, code)
    );

    CREATE TABLE IF NOT EXISTS designs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      public_id TEXT UNIQUE NOT NULL,
      customer_name TEXT,
      phone TEXT,
      room_type TEXT,
      curtain_style TEXT,
      material_id INTEGER,
      material_name TEXT,
      color_code TEXT,
      color_name TEXT,
      measurements TEXT,
      estimated_price INTEGER,
      preview_path TEXT,
      lighting TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      public_id TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      address TEXT,
      preferred_date TEXT,
      request_details TEXT,
      design_public_id TEXT,
      type TEXT NOT NULL DEFAULT 'consultation',
      status TEXT NOT NULL DEFAULT 'new',
      admin_note TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_colors_material ON colors(material_id);
    CREATE INDEX IF NOT EXISTS idx_colors_code ON colors(code);
    CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
  `);
}

function seed(db: DatabaseSyncLike) {
  const settingsRow = db.prepare("SELECT COUNT(*) as c FROM settings").get() as { c: number };
  if (!settingsRow || Number(settingsRow.c) === 0) {
    const insert = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
    for (const [k, v] of Object.entries(DEFAULT_PRICING)) insert.run(k, String(v));
  }

  const adminRow = db.prepare("SELECT COUNT(*) as c FROM admins").get() as { c: number };
  if (!adminRow || Number(adminRow.c) === 0) {
    const password = process.env.ADMIN_PASSWORD || "LenaHome2026";
    const { hash, salt } = hashPassword(password);
    db.prepare(
      "INSERT INTO admins (username, password_hash, salt, role) VALUES (?, ?, ?, 'owner')",
    ).run(process.env.ADMIN_USERNAME || "admin", hash, salt);
  }

  const matCount = db.prepare("SELECT COUNT(*) as c FROM materials").get() as { c: number };
  if (matCount && Number(matCount.c) > 0) return;

  const insertMaterial = db.prepare(`
    INSERT INTO materials (slug, name, name_en, price_per_meter, fabric_width, description, fabric, weight, opacity, sheen, availability, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertColor = db.prepare(`
    INSERT OR IGNORE INTO colors (material_id, code, name, hex, hex_source, family, style_tags, availability, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  MATERIALS.forEach((m, index) => {
    const res = insertMaterial.run(
      m.slug,
      m.name,
      m.nameEn,
      m.pricePerMeter,
      m.fabricWidth,
      m.description,
      m.fabric,
      m.weight,
      m.opacity,
      m.sheen,
      m.availability,
      index,
    );
    const materialId = Number(res.lastInsertRowid);
    m.colors.forEach((color, i) => {
      insertColor.run(
        materialId,
        color.code,
        color.name ?? null,
        color.hex ?? null,
        color.source,
        color.family ?? null,
        JSON.stringify(stylesForFamily(color.family)),
        m.availability,
        i,
      );
    });
  });
}

export function hashPassword(password: string, salt?: string) {
  const s = salt ?? crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, s, 64).toString("hex");
  return { hash, salt: s };
}

export function verifyPassword(password: string, hash: string, salt: string) {
  const candidate = crypto.scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(candidate, "hex");
  const b = Buffer.from(hash, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/* ----------------------------- materials ----------------------------- */

export type DbMaterial = {
  id: number;
  slug: string;
  name: string;
  name_en: string | null;
  price_per_meter: number | null;
  fabric_width: number;
  description: string | null;
  fabric: string;
  weight: string | null;
  opacity: number;
  sheen: number;
  availability: string;
  texture_image: string | null;
  color_count: number;
  min_hex: string | null;
};

export type DbColor = {
  id: number;
  material_id: number;
  code: string;
  name: string | null;
  hex: string | null;
  hex_source: string;
  family: string | null;
  style_tags: string[];
  swatch_image: string | null;
  availability: string;
  material_name: string;
  material_slug: string;
  price_per_meter: number | null;
  fabric: string;
};

function mapColor(row: Record<string, unknown>): DbColor {
  return {
    id: Number(row.id),
    material_id: Number(row.material_id),
    code: String(row.code),
    name: row.name ? String(row.name) : null,
    hex: row.hex ? String(row.hex) : null,
    hex_source: String(row.hex_source ?? "none"),
    family: row.family ? String(row.family) : null,
    style_tags: safeParseTags(row.style_tags),
    swatch_image: row.swatch_image ? String(row.swatch_image) : null,
    availability: String(row.availability ?? "available"),
    material_name: String(row.material_name ?? ""),
    material_slug: String(row.material_slug ?? ""),
    price_per_meter: row.price_per_meter == null ? null : Number(row.price_per_meter),
    fabric: String(row.fabric ?? "drape"),
  };
}

function safeParseTags(value: unknown): string[] {
  if (typeof value !== "string" || !value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function listMaterials(): DbMaterial[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT m.*, (SELECT COUNT(*) FROM colors c WHERE c.material_id = m.id) AS color_count,
        (SELECT hex FROM colors c WHERE c.material_id = m.id AND c.hex IS NOT NULL LIMIT 1) AS min_hex
       FROM materials m ORDER BY m.sort_order ASC, m.id ASC`,
    )
    .all();
  return rows.map((r) => ({
    ...(r as unknown as DbMaterial),
    id: Number(r.id),
    color_count: Number(r.color_count),
    price_per_meter: r.price_per_meter == null ? null : Number(r.price_per_meter),
    opacity: Number(r.opacity),
    sheen: Number(r.sheen),
  }));
}

export function getMaterialBySlug(slug: string): DbMaterial | null {
  return listMaterials().find((m) => m.slug === slug) ?? null;
}

export function listColors(filters: {
  material?: string;
  family?: string;
  style?: string;
  q?: string;
  hasHex?: boolean;
} = {}): DbColor[] {
  const db = getDb();
  const params: unknown[] = [];
  let sql = `SELECT c.*, m.name AS material_name, m.slug AS material_slug,
             m.price_per_meter AS price_per_meter, m.fabric AS fabric
             FROM colors c JOIN materials m ON m.id = c.material_id WHERE 1=1`;
  if (filters.material) {
    sql += " AND m.slug = ?";
    params.push(filters.material);
  }
  if (filters.family) {
    sql += " AND c.family = ?";
    params.push(filters.family);
  }
  if (filters.style) {
    sql += " AND c.style_tags LIKE ?";
    params.push(`%"${filters.style}"%`);
  }
  if (filters.q) {
    sql += " AND (c.code LIKE ? OR c.name LIKE ? OR m.name LIKE ?)";
    const like = `%${filters.q}%`;
    params.push(like, like, like);
  }
  if (filters.hasHex) sql += " AND c.hex IS NOT NULL";
  sql += " ORDER BY m.sort_order ASC, c.sort_order ASC, c.id ASC";
  return db.prepare(sql).all(...params).map(mapColor);
}

export function countColors(): number {
  const db = getDb();
  const row = db.prepare("SELECT COUNT(*) AS c FROM colors").get() as { c: number };
  return Number(row?.c ?? 0);
}

/* ------------------------------ settings ----------------------------- */

export function getPricingSettings(): PricingSettings {
  const db = getDb();
  const rows = db.prepare("SELECT key, value FROM settings").all();
  const map: Record<string, string> = {};
  for (const r of rows) map[String(r.key)] = String(r.value);
  const merged = { ...DEFAULT_PRICING } as PricingSettings;
  for (const key of Object.keys(DEFAULT_PRICING) as (keyof PricingSettings)[]) {
    const raw = map[key];
    if (raw != null && raw !== "" && !Number.isNaN(Number(raw))) merged[key] = Number(raw);
  }
  return merged;
}

export function setPricingSetting(key: string, value: string) {
  const db = getDb();
  db.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").run(
    key,
    value,
  );
}

/* ------------------------------- designs ----------------------------- */

export type DesignPayload = {
  customerName?: string | null;
  phone?: string | null;
  roomType?: string | null;
  curtainStyle?: string | null;
  materialId?: number | null;
  materialName?: string | null;
  colorCode?: string | null;
  colorName?: string | null;
  measurements?: unknown;
  estimatedPrice?: number | null;
  previewPath?: string | null;
  lighting?: string | null;
};

export function createDesign(payload: DesignPayload) {
  const db = getDb();
  const publicId = crypto.randomBytes(6).toString("hex");
  db.prepare(
    `INSERT INTO designs (public_id, customer_name, phone, room_type, curtain_style, material_id, material_name,
      color_code, color_name, measurements, estimated_price, preview_path, lighting)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    publicId,
    payload.customerName ?? null,
    payload.phone ?? null,
    payload.roomType ?? null,
    payload.curtainStyle ?? null,
    payload.materialId ?? null,
    payload.materialName ?? null,
    payload.colorCode ?? null,
    payload.colorName ?? null,
    payload.measurements ? JSON.stringify(payload.measurements) : null,
    payload.estimatedPrice ?? null,
    payload.previewPath ?? null,
    payload.lighting ?? null,
  );
  return publicId;
}

export function getDesign(publicId: string) {
  const db = getDb();
  const row = db.prepare("SELECT * FROM designs WHERE public_id = ?").get(publicId);
  return row ?? null;
}

export function listDesigns(limit = 200) {
  const db = getDb();
  return db.prepare("SELECT * FROM designs ORDER BY id DESC LIMIT ?").all(limit);
}

export function updateDesignContact(publicId: string, name: string, phone: string) {
  const db = getDb();
  db.prepare("UPDATE designs SET customer_name = ?, phone = ? WHERE public_id = ?").run(
    name,
    phone,
    publicId,
  );
}

/* ------------------------------ requests ------------------------------ */

export type RequestPayload = {
  customerName: string;
  phoneNumber: string;
  address?: string | null;
  preferredDate?: string | null;
  details?: string | null;
  designPublicId?: string | null;
  type?: string;
};

export function createRequest(payload: RequestPayload) {
  const db = getDb();
  const publicId = crypto.randomBytes(6).toString("hex");
  db.prepare(
    `INSERT INTO requests (public_id, customer_name, phone_number, address, preferred_date, request_details, design_public_id, type, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new')`,
  ).run(
    publicId,
    payload.customerName,
    payload.phoneNumber,
    payload.address ?? null,
    payload.preferredDate ?? null,
    payload.details ?? null,
    payload.designPublicId ?? null,
    payload.type ?? "consultation",
  );
  return publicId;
}

export function listRequests(limit = 200) {
  const db = getDb();
  return db.prepare("SELECT * FROM requests ORDER BY id DESC LIMIT ?").all(limit);
}

export function setRequestStatus(id: number, status: string, note?: string) {
  const db = getDb();
  db.prepare("UPDATE requests SET status = ?, admin_note = COALESCE(?, admin_note) WHERE id = ?").run(
    status,
    note ?? null,
    id,
  );
}

/* -------------------------------- stats ------------------------------- */

export function adminStats() {
  const db = getDb();
  const one = (sql: string) => {
    const row = db.prepare(sql).get() as { c: number } | undefined;
    return Number(row?.c ?? 0);
  };
  return {
    materials: one("SELECT COUNT(*) c FROM materials"),
    colors: one("SELECT COUNT(*) c FROM colors"),
    designs: one("SELECT COUNT(*) c FROM designs"),
    requests: one("SELECT COUNT(*) c FROM requests"),
    newRequests: one("SELECT COUNT(*) c FROM requests WHERE status = 'new'"),
  };
}

export function unseededColorSeeds(materialSlug: string): ColorSeed[] {
  return MATERIALS.find((m) => m.slug === materialSlug)?.colors ?? [];
}
