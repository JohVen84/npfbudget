import { sql } from "drizzle-orm";
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { BILL_CATEGORIES } from "@/lib/categories";

const billCategoryValues = BILL_CATEGORIES.map((c) => c.value) as [
  string,
  ...string[],
];

export const persons = sqliteTable("persons", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const months = sqliteTable(
  "months",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    label: text("label").notNull(),
    status: text("status", { enum: ["active", "archived"] })
      .notNull()
      .default("active"),
    billsFinalized: integer("bills_finalized", { mode: "boolean" })
      .notNull()
      .default(false),
    finalizedAt: text("finalized_at"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (t) => [
    uniqueIndex("months_one_active_idx")
      .on(t.status)
      .where(sql`${t.status} = 'active'`),
  ],
);

export const bills = sqliteTable(
  "bills",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    monthId: integer("month_id")
      .notNull()
      .references(() => months.id),
    name: text("name").notNull(),
    amountOre: integer("amount_ore").notNull(),
    type: text("type", { enum: ["one_time", "recurring"] }).notNull(),
    category: text("category", { enum: billCategoryValues }),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(current_timestamp)`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (t) => [index("bills_month_id_idx").on(t.monthId)],
);

export const incomes = sqliteTable(
  "incomes",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    monthId: integer("month_id")
      .notNull()
      .references(() => months.id),
    personId: integer("person_id")
      .notNull()
      .references(() => persons.id),
    amountOre: integer("amount_ore").notNull(),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(current_timestamp)`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (t) => [index("incomes_month_person_idx").on(t.monthId, t.personId)],
);
