"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { bills } from "@/server/db/schema";
import {
  billCategorySchema,
  billNameSchema,
  billTypeSchema,
  moneyInputSchema,
} from "@/lib/validation";

function revalidateMonthPaths() {
  revalidatePath("/month/[monthId]", "page");
}

function parseCategory(rawCategory: FormDataEntryValue | null) {
  return rawCategory ? billCategorySchema.parse(rawCategory) : null;
}

export async function addBill(monthId: number, formData: FormData): Promise<void> {
  const parsedName = billNameSchema.parse(formData.get("name"));
  const amountOre = moneyInputSchema.parse(formData.get("amount"));
  const parsedType = billTypeSchema.parse(formData.get("type"));
  const category = parseCategory(formData.get("category"));

  await db.insert(bills).values({
    monthId,
    name: parsedName,
    amountOre,
    type: parsedType,
    category,
  });

  revalidateMonthPaths();
}

export async function updateBill(billId: number, formData: FormData): Promise<void> {
  const parsedName = billNameSchema.parse(formData.get("name"));
  const amountOre = moneyInputSchema.parse(formData.get("amount"));
  const parsedType = billTypeSchema.parse(formData.get("type"));
  const category = parseCategory(formData.get("category"));

  await db
    .update(bills)
    .set({
      name: parsedName,
      amountOre,
      type: parsedType,
      category,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(bills.id, billId));

  revalidateMonthPaths();
}

export async function deleteBill(billId: number): Promise<void> {
  await db.delete(bills).where(eq(bills.id, billId));

  revalidateMonthPaths();
}
