"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { incomes } from "@/server/db/schema";
import { moneyInputSchema } from "@/lib/validation";

function revalidateMonthPaths() {
  revalidatePath("/month/[monthId]", "page");
}

export async function addIncome(
  monthId: number,
  personId: number,
  formData: FormData,
): Promise<void> {
  const amountOre = moneyInputSchema.parse(formData.get("amount"));

  await db.insert(incomes).values({ monthId, personId, amountOre });

  revalidateMonthPaths();
}

export async function updateIncome(incomeId: number, formData: FormData): Promise<void> {
  const amountOre = moneyInputSchema.parse(formData.get("amount"));

  await db
    .update(incomes)
    .set({ amountOre, updatedAt: new Date().toISOString() })
    .where(eq(incomes.id, incomeId));

  revalidateMonthPaths();
}

export async function deleteIncome(incomeId: number): Promise<void> {
  await db.delete(incomes).where(eq(incomes.id, incomeId));

  revalidateMonthPaths();
}
