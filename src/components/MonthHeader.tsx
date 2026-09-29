import Link from "next/link";
import { startNewMonth } from "@/server/actions/month.actions";

export function MonthHeader({
  label,
  isActive,
}: {
  label: string;
  isActive: boolean;
}) {
  return (
    <header className="flex items-start justify-between gap-3">
      <div>
        <h1 className="text-lg font-semibold text-slate-800">{label}</h1>
        {!isActive && (
          <span className="mt-1 inline-block rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600">
            Arkiverad
          </span>
        )}
        <div>
          <Link href="/archive" className="text-xs text-slate-500 underline">
            Visa arkiv
          </Link>
        </div>
      </div>

      {isActive && (
        <details className="text-right">
          <summary className="cursor-pointer list-none rounded-md bg-slate-800 px-3 py-1.5 text-sm font-medium text-white">
            Starta ny månad
          </summary>
          <form action={startNewMonth} className="mt-2 flex flex-col items-end gap-2">
            <input
              type="text"
              name="label"
              placeholder="t.ex. Oktober 2026"
              required
              className="w-40 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
            />
            <button
              type="submit"
              className="rounded-md bg-slate-800 px-3 py-1.5 text-sm font-medium text-white"
            >
              Bekräfta
            </button>
          </form>
        </details>
      )}
    </header>
  );
}
