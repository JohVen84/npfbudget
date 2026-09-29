import { ConfirmDeleteButton } from "@/components/ConfirmDeleteButton";
import { MoneyInput } from "@/components/MoneyInput";
import { oreToInputValue } from "@/lib/money";
import { addIncome, deleteIncome, updateIncome } from "@/server/actions/income.actions";

type Income = { id: number; personId: number; amountOre: number };
type Person = { id: number; name: string };

export function IncomeSection({
  incomes,
  persons,
  monthId,
}: {
  incomes: Income[];
  persons: Person[];
  monthId: number;
}) {
  return (
    <section className="mt-8">
      <h2 className="text-sm font-medium text-slate-500">Inkomst</h2>

      <div className="mt-2 space-y-5">
        {persons.map((person) => {
          const personIncomes = incomes.filter((income) => income.personId === person.id);

          return (
            <div key={person.id}>
              <h3 className="text-sm font-medium text-slate-700">{person.name}</h3>

              <ul className="mt-1 space-y-2">
                {personIncomes.map((income) => (
                  <li
                    key={income.id}
                    className="flex items-center justify-between gap-2 rounded-lg bg-white p-3 shadow-sm"
                  >
                    <form
                      action={updateIncome.bind(null, income.id)}
                      className="flex items-center gap-2"
                    >
                      <MoneyInput name="amount" defaultValue={oreToInputValue(income.amountOre)} />
                      <button
                        type="submit"
                        className="rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700"
                      >
                        Spara
                      </button>
                    </form>
                    <ConfirmDeleteButton
                      deleteAction={deleteIncome.bind(null, income.id)}
                      confirmLabel="Radera inkomstpost?"
                    />
                  </li>
                ))}
              </ul>

              <form
                action={addIncome.bind(null, monthId, person.id)}
                className="mt-2 flex items-center gap-2 rounded-lg border border-dashed border-slate-300 p-3"
              >
                <MoneyInput name="amount" />
                <button
                  type="submit"
                  className="rounded-md bg-slate-800 px-3 py-1.5 text-sm font-medium text-white"
                >
                  Lägg till inkomst
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </section>
  );
}
