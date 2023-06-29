export const FIAT_CURRENCIES = ["USD", "EUR", "SGD"] as const;
type FiatCurrency = (typeof FIAT_CURRENCIES)[number];

export const isFiatCurrency = (currency: string): currency is FiatCurrency =>
  FIAT_CURRENCIES.includes(currency as FiatCurrency);

export const CRYPTO_CURRENCIES = ["BTC", "ETH", "DOGE"] as const;
type CryptoCurrency = (typeof CRYPTO_CURRENCIES)[number];

export const isCrpytoCurrency = (
  currency: string
): currency is CryptoCurrency =>
  CRYPTO_CURRENCIES.includes(currency as CryptoCurrency);

export type Currency = FiatCurrency | CryptoCurrency;

export const CURRENCY_TYPES = ["fiat", "crypto"] as const;
type CurrencyType = (typeof CURRENCY_TYPES)[number];

export const isCurrencyType = (type: string): type is CurrencyType =>
  CURRENCY_TYPES.includes(type as CurrencyType);
