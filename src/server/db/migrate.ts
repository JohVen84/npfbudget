import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { sqlitePath } from "./path";

const sqlite = new Database(sqlitePath);
const db = drizzle(sqlite);

migrate(db, { migrationsFolder: "./drizzle" });

sqlite.close();

console.log(`Migrations applied to ${sqlitePath}`);
