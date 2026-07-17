export type CurrencyOption = {
  code: string;
  name: string;
  country: string;
  flag: string;
};

export const currencies: CurrencyOption[] = [
  { code: "USD", name: "US dollar", country: "United States", flag: "\u{1F1FA}\u{1F1F8}" },
  { code: "ILS", name: "Israeli new shekel", country: "Israel", flag: "\u{1F1EE}\u{1F1F1}" },
  { code: "EUR", name: "Euro", country: "Euro area", flag: "\u{1F1EA}\u{1F1FA}" },
  { code: "GBP", name: "Pound sterling", country: "United Kingdom", flag: "\u{1F1EC}\u{1F1E7}" },
  { code: "CAD", name: "Canadian dollar", country: "Canada", flag: "\u{1F1E8}\u{1F1E6}" },
  { code: "AUD", name: "Australian dollar", country: "Australia", flag: "\u{1F1E6}\u{1F1FA}" },
  { code: "NZD", name: "New Zealand dollar", country: "New Zealand", flag: "\u{1F1F3}\u{1F1FF}" },
  { code: "CHF", name: "Swiss franc", country: "Switzerland", flag: "\u{1F1E8}\u{1F1ED}" },
  { code: "JPY", name: "Japanese yen", country: "Japan", flag: "\u{1F1EF}\u{1F1F5}" },
  { code: "CNY", name: "Chinese yuan", country: "China", flag: "\u{1F1E8}\u{1F1F3}" },
  { code: "INR", name: "Indian rupee", country: "India", flag: "\u{1F1EE}\u{1F1F3}" },
  { code: "BRL", name: "Brazilian real", country: "Brazil", flag: "\u{1F1E7}\u{1F1F7}" },
  { code: "MXN", name: "Mexican peso", country: "Mexico", flag: "\u{1F1F2}\u{1F1FD}" },
  { code: "ZAR", name: "South African rand", country: "South Africa", flag: "\u{1F1FF}\u{1F1E6}" },
  { code: "SEK", name: "Swedish krona", country: "Sweden", flag: "\u{1F1F8}\u{1F1EA}" },
  { code: "NOK", name: "Norwegian krone", country: "Norway", flag: "\u{1F1F3}\u{1F1F4}" },
  { code: "DKK", name: "Danish krone", country: "Denmark", flag: "\u{1F1E9}\u{1F1F0}" },
  { code: "PLN", name: "Polish zloty", country: "Poland", flag: "\u{1F1F5}\u{1F1F1}" },
  { code: "TRY", name: "Turkish lira", country: "Turkey", flag: "\u{1F1F9}\u{1F1F7}" },
  { code: "SGD", name: "Singapore dollar", country: "Singapore", flag: "\u{1F1F8}\u{1F1EC}" },
];

export function findCurrencyOption(code: string) {
  return currencies.find((currency) => currency.code === code);
}

export function isSupportedCurrencyCode(code: string) {
  return findCurrencyOption(code) !== undefined;
}
