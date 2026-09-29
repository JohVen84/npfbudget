export const BILL_CATEGORIES = [
  { value: "hem", label: "Hem" },
  { value: "bil_transport", label: "Bil/Transport" },
  { value: "forsakringar", label: "Försäkringar" },
  { value: "mat", label: "Mat" },
  { value: "noje", label: "Nöje" },
  { value: "halsa", label: "Hälsa" },
  { value: "abonnemang", label: "Abonnemang" },
  { value: "ovrigt", label: "Övrigt" },
] as const;

export type BillCategory = (typeof BILL_CATEGORIES)[number]["value"];

export function categoryLabel(value: string | null): string | null {
  return BILL_CATEGORIES.find((c) => c.value === value)?.label ?? null;
}
