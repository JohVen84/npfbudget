"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { persons } from "@/server/db/schema";
import { personNameSchema } from "@/lib/validation";

export async function setupHousehold(formData: FormData): Promise<void> {
  const existing = await db.select({ id: persons.id }).from(persons);
  if (existing.length > 0) {
    throw new Error("Hushållet är redan konfigurerat");
  }

  const parsedA = personNameSchema.parse(formData.get("nameA"));
  const parsedB = personNameSchema.parse(formData.get("nameB"));

  await db.insert(persons).values([{ name: parsedA }, { name: parsedB }]);

  revalidatePath("/");
}

export async function renamePerson(personId: number, formData: FormData): Promise<void> {
  const parsedName = personNameSchema.parse(formData.get("name"));

  await db.update(persons).set({ name: parsedName }).where(eq(persons.id, personId));

  revalidatePath("/");
  revalidatePath("/month/[monthId]", "page");
}
