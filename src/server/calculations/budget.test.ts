import { describe, expect, it } from "vitest";
import { computeMonthSummary, splitEvenly } from "./budget";

describe("splitEvenly", () => {
  it("splits an even amount exactly in half", () => {
    expect(splitEvenly(845050, 2)).toEqual([422525, 422525]);
  });

  it("distributes an odd öre remainder deterministically", () => {
    expect(splitEvenly(10001, 2)).toEqual([5001, 5000]);
  });

  it("handles zero", () => {
    expect(splitEvenly(0, 2)).toEqual([0, 0]);
  });

  it("always sums back to the total, for many random totals", () => {
    for (let i = 0; i < 200; i++) {
      const total = Math.floor(Math.random() * 10_000_000);
      const parts = splitEvenly(total, 2);
      expect(parts.reduce((a, b) => a + b, 0)).toBe(total);
    }
  });
});

describe("computeMonthSummary", () => {
  const persons = [{ id: 1 }, { id: 2 }];

  it("handles no bills and no income", () => {
    const summary = computeMonthSummary({ bills: [], incomes: [], persons });
    expect(summary.totalBillsOre).toBe(0);
    expect(summary.perPerson).toEqual([
      { personId: 1, depositOre: 0, incomeOre: 0, leftoverOre: 0 },
      { personId: 2, depositOre: 0, incomeOre: 0, leftoverOre: 0 },
    ]);
  });

  it("splits bills 50/50 and computes leftover per person", () => {
    const summary = computeMonthSummary({
      bills: [{ amountOre: 800000 }, { amountOre: 45050 }],
      incomes: [
        { personId: 1, amountOre: 2000000 },
        { personId: 2, amountOre: 1800000 },
      ],
      persons,
    });

    expect(summary.totalBillsOre).toBe(845050);
    expect(summary.perPerson).toEqual([
      { personId: 1, depositOre: 422525, incomeOre: 2000000, leftoverOre: 1577475 },
      { personId: 2, depositOre: 422525, incomeOre: 1800000, leftoverOre: 1377475 },
    ]);
  });

  it("sums multiple income entries for the same person", () => {
    const summary = computeMonthSummary({
      bills: [],
      incomes: [
        { personId: 1, amountOre: 2000000 },
        { personId: 1, amountOre: 50000 },
      ],
      persons,
    });

    expect(summary.perPerson[0].incomeOre).toBe(2050000);
  });
});
