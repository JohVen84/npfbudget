import { describe, expect, it } from "vitest";
import { InvalidMoneyInputError, krInputToOre, oreToInputValue, oreToKr } from "./money";

const NBSP = " ";

describe("oreToKr", () => {
  it("formats whole kronor", () => {
    expect(oreToKr(800000)).toBe(`8${NBSP}000,00${NBSP}kr`);
  });

  it("formats öre", () => {
    expect(oreToKr(45050)).toBe(`450,50${NBSP}kr`);
  });

  it("formats zero", () => {
    expect(oreToKr(0)).toBe(`0,00${NBSP}kr`);
  });
});

describe("oreToInputValue", () => {
  it("round-trips through krInputToOre", () => {
    expect(krInputToOre(oreToInputValue(845050))).toBe(845050);
  });

  it("pads to two decimals", () => {
    expect(oreToInputValue(800000)).toBe("8000.00");
  });
});

describe("krInputToOre", () => {
  it("parses a plain integer", () => {
    expect(krInputToOre("8000")).toBe(800000);
  });

  it("parses a comma decimal", () => {
    expect(krInputToOre("450,50")).toBe(45050);
  });

  it("parses a dot decimal", () => {
    expect(krInputToOre("450.5")).toBe(45050);
  });

  it("parses a single decimal digit", () => {
    expect(krInputToOre("100,1")).toBe(10010);
  });

  it("rejects more than two decimals", () => {
    expect(() => krInputToOre("100,123")).toThrow(InvalidMoneyInputError);
  });

  it("rejects non-numeric input", () => {
    expect(() => krInputToOre("abc")).toThrow(InvalidMoneyInputError);
  });

  it("rejects negative input", () => {
    expect(() => krInputToOre("-100")).toThrow(InvalidMoneyInputError);
  });
});
