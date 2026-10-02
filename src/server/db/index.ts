import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import { sqlitePath } from "./path";

declare global {
  // eslint-disable-next-line no-var
  var __sqlite: Database.Database | undefined;
}

const sqlite = globalThis.__sqlite ?? new Database(sqlitePath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

if (process.env.NODE_ENV !== "production") {
  globalThis.__sqlite = sqlite;
}

export const db = drizzle(sqlite, { schema });
