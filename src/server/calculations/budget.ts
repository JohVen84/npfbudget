export function splitEvenly(totalOre: number, parts: number): number[] {
  const base = Math.floor(totalOre / parts);
  const remainder = totalOre - base * parts;
  return Array.from({ length: parts }, (_, i) => base + (i < remainder ? 1 : 0));
}

export interface PersonSummary {
  personId: number;
  depositOre: number;
  incomeOre: number;
  leftoverOre: number;
}

export interface MonthSummary {
  totalBillsOre: number;
  perPerson: PersonSummary[];
}

export function computeMonthSummary(input: {
  bills: { amountOre: number }[];
  incomes: { personId: number; amountOre: number }[];
  persons: { id: number }[];
}): MonthSummary {
  const totalBillsOre = input.bills.reduce((sum, b) => sum + b.amountOre, 0);
  const deposits = splitEvenly(totalBillsOre, input.persons.length || 1);

  const perPerson = input.persons.map((person, i) => {
    const incomeOre = input.incomes
      .filter((income) => income.personId === person.id)
      .reduce((sum, income) => sum + income.amountOre, 0);
    const depositOre = deposits[i] ?? 0;
    return {
      personId: person.id,
      depositOre,
      incomeOre,
      leftoverOre: incomeOre - depositOre,
    };
  });

  return { totalBillsOre, perPerson };
}
