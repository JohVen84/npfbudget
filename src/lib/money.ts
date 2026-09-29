const krFormatter = new Intl.NumberFormat("sv-SE", {
  style: "currency",
  currency: "SEK",
});

export function oreToKr(ore: number): string {
  return krFormatter.format(ore / 100);
}

export function oreToInputValue(ore: number): string {
  return (ore / 100).toFixed(2);
}

export class InvalidMoneyInputError extends Error {}

export function krInputToOre(input: string): number {
  const normalized = input.trim().replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    throw new InvalidMoneyInputError(`Invalid amount: "${input}"`);
  }
  const [kr, ore = ""] = normalized.split(".");
  const oreValue = (ore + "00").slice(0, 2);
  return Number(kr) * 100 + Number(oreValue);
}
