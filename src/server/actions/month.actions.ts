"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { bills, months, persons } from "@/server/db/schema";
import { monthLabelSchema } from "@/lib/validation";

function revalidateMonthPaths() {
  revalidatePath("/month/[monthId]", "page");
  revalidatePath("/archive");
  revalidatePath("/");
}

export async function startFirstMonth(formData: FormData): Promise<void> {
  const parsedLabel = monthLabelSchema.parse(formData.get("label"));

  const existingPersons = await db.select({ id: persons.id }).from(persons);
  if (existingPersons.length < 2) {
    throw new Error("Hushållet måste ha två personer innan en månad kan startas");
  }

  const existingMonths = await db.select({ id: months.id }).from(months);
  if (existingMonths.length > 0) {
    throw new Error("En månad finns redan");
  }

  const [newMonth] = await db
    .insert(months)
    .values({ label: parsedLabel, status: "active" })
    .returning({ id: months.id });

  revalidateMonthPaths();
  redirect(`/month/${newMonth.id}`);
}

export async function startNewMonth(formData: FormData): Promise<void> {
  const parsedLabel = monthLabelSchema.parse(formData.get("label"));

  const newMonthId = db.transaction((tx) => {
    const [currentActive] = tx
      .select({ id: months.id })
      .from(months)
      .where(eq(months.status, "active"))
      .all();

    if (!currentActive) {
      throw new Error("Ingen aktiv månad hittades");
    }

    tx.update(months)
      .set({ status: "archived" })
      .where(eq(months.id, currentActive.id))
      .run();

    const [newMonth] = tx
      .insert(months)
      .values({ label: parsedLabel, status: "active" })
      .returning({ id: months.id })
      .all();

    const recurringBills = tx
      .select({ name: bills.name, amountOre: bills.amountOre, category: bills.category })
      .from(bills)
      .where(and(eq(bills.monthId, currentActive.id), eq(bills.type, "recurring")))
      .all();

    if (recurringBills.length > 0) {
      tx.insert(bills)
        .values(
          recurringBills.map((bill) => ({
            monthId: newMonth.id,
            name: bill.name,
            amountOre: bill.amountOre,
            category: bill.category,
            type: "recurring" as const,
          })),
        )
        .run();
    }

    return newMonth.id;
  });

  revalidateMonthPaths();
  redirect(`/month/${newMonthId}`);
}

export async function markMonthBillsComplete(monthId: number): Promise<void> {
  await db
    .update(months)
    .set({ billsFinalized: true, finalizedAt: new Date().toISOString() })
    .where(eq(months.id, monthId));

  revalidateMonthPaths();
}

export async function unmarkMonthBillsComplete(monthId: number): Promise<void> {
  await db
    .update(months)
    .set({ billsFinalized: false, finalizedAt: null })
    .where(eq(months.id, monthId));

  revalidateMonthPaths();
}

export async function renameMonth(monthId: number, formData: FormData): Promise<void> {
  const parsedLabel = monthLabelSchema.parse(formData.get("label"));

  await db.update(months).set({ label: parsedLabel }).where(eq(months.id, monthId));

  revalidateMonthPaths();
}
