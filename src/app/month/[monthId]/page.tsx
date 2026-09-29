import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { BillsSection } from "@/components/BillsSection";
import { IncomeSection } from "@/components/IncomeSection";
import { LeftoverPanel } from "@/components/LeftoverPanel";
import { MonthHeader } from "@/components/MonthHeader";
import { db } from "@/server/db";
import { bills, incomes, months, persons } from "@/server/db/schema";
import { computeMonthSummary } from "@/server/calculations/budget";

export default async function MonthPage({
  params,
}: {
  params: Promise<{ monthId: string }>;
}) {
  const { monthId: monthIdParam } = await params;
  const monthId = Number(monthIdParam);

  if (!Number.isInteger(monthId)) {
    notFound();
  }

  const [month] = await db.select().from(months).where(eq(months.id, monthId));
  if (!month) {
    notFound();
  }

  const [monthBills, monthIncomes, allPersons] = await Promise.all([
    db.select().from(bills).where(eq(bills.monthId, monthId)),
    db.select().from(incomes).where(eq(incomes.monthId, monthId)),
    db.select().from(persons).orderBy(persons.id),
  ]);

  const summary = computeMonthSummary({
    bills: monthBills,
    incomes: monthIncomes,
    persons: allPersons,
  });

  const personNames = Object.fromEntries(allPersons.map((p) => [p.id, p.name]));

  return (
    <main>
      <MonthHeader label={month.label} isActive={month.status === "active"} />

      <LeftoverPanel
        summary={summary}
        personNames={personNames}
        finalized={month.billsFinalized}
        monthId={month.id}
      />

      <BillsSection bills={monthBills} monthId={month.id} totalOre={summary.totalBillsOre} />

      <IncomeSection incomes={monthIncomes} persons={allPersons} monthId={month.id} />
    </main>
  );
}
