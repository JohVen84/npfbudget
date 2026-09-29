import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

const sqlitePath = process.env.SQLITE_PATH ?? "./data/npf-budget.db";

const sqlite = new Database(sqlitePath);
const db = drizzle(sqlite);

migrate(db, { migrationsFolder: "./drizzle" });

sqlite.close();

console.log(`Migrations applied to ${sqlitePath}`);
