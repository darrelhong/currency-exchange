export const FIAT_CURRENCIES = ["USD", "EUR", "SGD"] as const;
type FiatCurrency = (typeof FIAT_CURRENCIES)[number];
export const CRYPTO_CURRENCIES = ["BTC", "ETH", "DOGE"] as const;
type CryptoCurrency = (typeof CRYPTO_CURRENCIES)[number];

export type Currency = FiatCurrency | CryptoCurrency;

export type CurrencyType = "fiat" | "crypto";
