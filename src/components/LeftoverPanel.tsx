import { oreToKr } from "@/lib/money";
import { markMonthBillsComplete, unmarkMonthBillsComplete } from "@/server/actions/month.actions";
import type { MonthSummary } from "@/server/calculations/budget";

export function LeftoverPanel({
  summary,
  personNames,
  finalized,
  monthId,
}: {
  summary: MonthSummary;
  personNames: Record<number, string>;
  finalized: boolean;
  monthId: number;
}) {
  return (
    <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
      <div className="grid grid-cols-2 gap-4">
        {summary.perPerson.map((person) => (
          <div key={person.personId} className="text-center">
            <p className="truncate text-sm font-medium text-slate-500">
              {personNames[person.personId] ?? "?"}
            </p>

            <p className="mt-2 text-xs text-slate-400">Sätt in</p>
            <p className="text-lg font-semibold text-slate-700">{oreToKr(person.depositOre)}</p>

            <p className="mt-3 text-xs text-slate-400">Kvar</p>
            {finalized ? (
              <p className="text-2xl font-bold text-teal-700">{oreToKr(person.leftoverOre)}</p>
            ) : (
              <p className="text-2xl font-bold text-slate-300">—</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 text-center">
        {finalized ? (
          <form action={unmarkMonthBillsComplete.bind(null, monthId)}>
            <button type="submit" className="text-sm text-slate-500 underline">
              Fortsätt redigera
            </button>
          </form>
        ) : (
          <form action={markMonthBillsComplete.bind(null, monthId)}>
            <button
              type="submit"
              className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white"
            >
              Markera räkningar som klara
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
