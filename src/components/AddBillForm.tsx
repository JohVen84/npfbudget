"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { MoneyInput } from "@/components/MoneyInput";
import { BILL_CATEGORIES } from "@/lib/categories";
import { addBill } from "@/server/actions/bill.actions";

type FlashState = { addedName: string; nonce: number } | null;

export function AddBillForm({ monthId }: { monthId: number }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [flash, formAction, pending] = useActionState<FlashState, FormData>(
    async (_prev, formData) => {
      const name = String(formData.get("name") ?? "").trim();
      await addBill(monthId, formData);
      return { addedName: name, nonce: Date.now() };
    },
    null,
  );
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!flash) return;
    formRef.current?.reset();
    setVisible(true);
    const timeout = setTimeout(() => setVisible(false), 2500);
    return () => clearTimeout(timeout);
  }, [flash]);

  return (
    <div className="mt-3">
      <form
        ref={formRef}
        action={formAction}
        className="flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-slate-300 p-3"
      >
        <input
          type="text"
          name="name"
          placeholder="Namn"
          required
          className="min-w-0 flex-1 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
        />
        <MoneyInput name="amount" />
        <select
          name="type"
          defaultValue="one_time"
          className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
        >
          <option value="one_time">Engångs</option>
          <option value="recurring">Återkommande</option>
        </select>
        <select
          name="category"
          defaultValue=""
          className="rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-600"
        >
          <option value="">Ingen kategori</option>
          {BILL_CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-slate-800 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
        >
          Lägg till räkning
        </button>
      </form>
      {flash && (
        <p
          className={`mt-2 text-sm text-teal-700 transition-opacity duration-500 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          ✓ {flash.addedName} tillagd
        </p>
      )}
    </div>
  );
}
