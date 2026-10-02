import fs from "node:fs";
import path from "node:path";

export const sqlitePath = process.env.SQLITE_PATH ?? "./data/npf-budget.db";

// better-sqlite3 creates the database file but not its directory.
fs.mkdirSync(path.dirname(sqlitePath), { recursive: true });
