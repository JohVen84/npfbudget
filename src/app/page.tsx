import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { months, persons } from "@/server/db/schema";
import { setupHousehold } from "@/server/actions/person.actions";
import { startFirstMonth } from "@/server/actions/month.actions";

export const dynamic = "force-dynamic";

export default async function Home() {
  const existingPersons = await db.select({ id: persons.id }).from(persons);

  if (existingPersons.length < 2) {
    return (
      <main>
        <h1 className="text-lg font-semibold text-slate-800">Välkommen</h1>
        <p className="mt-2 text-sm text-slate-600">
          Ange namnen på hushållets två personer för att komma igång.
        </p>
        <form action={setupHousehold} className="mt-4 space-y-3">
          <input
            type="text"
            name="nameA"
            placeholder="Person 1"
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            type="text"
            name="nameB"
            placeholder="Person 2"
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="w-full rounded-md bg-slate-800 px-3 py-2 text-sm font-medium text-white"
          >
            Kom igång
          </button>
        </form>
      </main>
    );
  }

  const [activeMonth] = await db
    .select({ id: months.id })
    .from(months)
    .where(eq(months.status, "active"));

  if (!activeMonth) {
    return (
      <main>
        <h1 className="text-lg font-semibold text-slate-800">Ingen månad startad</h1>
        <p className="mt-2 text-sm text-slate-600">
          Starta den första månaden för att börja lägga in räkningar och inkomst.
        </p>
        <form action={startFirstMonth} className="mt-4 space-y-3">
          <input
            type="text"
            name="label"
            placeholder="t.ex. September 2026"
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="w-full rounded-md bg-slate-800 px-3 py-2 text-sm font-medium text-white"
          >
            Starta första månaden
          </button>
        </form>
      </main>
    );
  }

  redirect(`/month/${activeMonth.id}`);
}
