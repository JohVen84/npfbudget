import { z } from "zod";
import { BILL_CATEGORIES } from "./categories";
import { krInputToOre } from "./money";

export const moneyInputSchema = z
  .string()
  .trim()
  .min(1, "Ange ett belopp")
  .transform((val, ctx) => {
    try {
      return krInputToOre(val);
    } catch {
      ctx.addIssue({ code: "custom", message: "Ogiltigt belopp" });
      return z.NEVER;
    }
  });

export const billNameSchema = z.string().trim().min(1, "Ange ett namn").max(100);

export const personNameSchema = z.string().trim().min(1, "Ange ett namn").max(50);

export const monthLabelSchema = z.string().trim().min(1, "Ange en etikett").max(100);

export const billTypeSchema = z.enum(["one_time", "recurring"]);

export const billCategorySchema = z.enum(
  BILL_CATEGORIES.map((c) => c.value) as [string, ...string[]],
);
