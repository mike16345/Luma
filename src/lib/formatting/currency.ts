export function formatCurrencyFromMinorUnits(
  valueMinor: number,
  currencyCode: string,
  locale = undefined as string | undefined
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  }).format(valueMinor / 100);
}
