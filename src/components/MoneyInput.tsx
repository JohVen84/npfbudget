export function MoneyInput({
  name,
  defaultValue,
  placeholder,
}: {
  name: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      inputMode="decimal"
      name={name}
      defaultValue={defaultValue}
      placeholder={placeholder ?? "0,00"}
      required
      className="w-24 rounded-md border border-slate-300 px-2 py-1.5 text-right text-sm"
    />
  );
}
