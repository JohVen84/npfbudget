import { AddBillForm } from "@/components/AddBillForm";
import { ConfirmDeleteButton } from "@/components/ConfirmDeleteButton";
import { MoneyInput } from "@/components/MoneyInput";
import { BILL_CATEGORIES, categoryLabel } from "@/lib/categories";
import { oreToInputValue, oreToKr } from "@/lib/money";
import { deleteBill, updateBill } from "@/server/actions/bill.actions";

type Bill = {
  id: number;
  name: string;
  amountOre: number;
  type: "one_time" | "recurring";
  category: string | null;
  updatedAt: string;
};

function CategorySelect({ defaultValue }: { defaultValue: string }) {
  return (
    <select
      name="category"
      defaultValue={defaultValue}
      className="rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-600"
    >
      <option value="">Ingen kategori</option>
      {BILL_CATEGORIES.map((category) => (
        <option key={category.value} value={category.value}>
          {category.label}
        </option>
      ))}
    </select>
  );
}

export function BillsSection({ bills, monthId, totalOre }: { bills: Bill[]; monthId: number; totalOre: number }) {
  return (
    <section className="mt-8">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-medium text-slate-500">Räkningar</h2>
        <span className="text-sm text-slate-500">{oreToKr(totalOre)}</span>
      </div>

      {bills.length > 0 && (
        <details className="mt-2">
          <summary className="cursor-pointer text-sm text-slate-500">
            Visa räkningar ({bills.length} st)
          </summary>
          <ul className="mt-2 space-y-2">
            {bills.map((bill) => (
              <li key={`${bill.id}-${bill.updatedAt}`} className="rounded-lg bg-white p-3 shadow-sm">
                {bill.category && (
                  <span className="mb-2 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                    {categoryLabel(bill.category)}
                  </span>
                )}
                <form
                  action={updateBill.bind(null, bill.id)}
                  className="flex flex-wrap items-center gap-2"
                >
                  <input
                    type="text"
                    name="name"
                    defaultValue={bill.name}
                    required
                    className="min-w-0 flex-1 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                  />
                  <MoneyInput name="amount" defaultValue={oreToInputValue(bill.amountOre)} />
                  <select
                    name="type"
                    defaultValue={bill.type}
                    className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                  >
                    <option value="one_time">Engångs</option>
                    <option value="recurring">Återkommande</option>
                  </select>
                  <CategorySelect defaultValue={bill.category ?? ""} />
                  <button
                    type="submit"
                    className="rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700"
                  >
                    Spara
                  </button>
                </form>
                <div className="mt-1 flex justify-end">
                  <ConfirmDeleteButton
                    deleteAction={deleteBill.bind(null, bill.id)}
                    confirmLabel={`Radera ${bill.name}?`}
                  />
                </div>
              </li>
            ))}
          </ul>
        </details>
      )}

      <AddBillForm monthId={monthId} />
    </section>
  );
}
