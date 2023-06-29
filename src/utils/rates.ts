import {
  CRYPTO_CURRENCIES,
  Currency,
  CurrencyType,
  FIAT_CURRENCIES,
} from "../types/rates.js";

const getCoinbaseRate = async ({
  baseCurrency,
}: {
  baseCurrency: Currency;
}) => {
  // fetch exchange rate from coinbase API
  const res = await fetch(
    `https://api.coinbase.com/v2/exchange-rates?currency=${baseCurrency}`
  );
  const { data } = await res.json();
  return data.rates as Record<string, string>;
};

export const getExchageRates = async ({
  currencyType,
}: {
  currencyType: CurrencyType;
}) => {
  const currencies =
    currencyType === "fiat" ? FIAT_CURRENCIES : CRYPTO_CURRENCIES;
  const resultCurrencies =
    currencyType === "fiat" ? CRYPTO_CURRENCIES : FIAT_CURRENCIES;

  // fetch exchange rates from coinbase API in parallel
  const currencyRates = await Promise.all(
    currencies.map((currency) => getCoinbaseRate({ baseCurrency: currency }))
  );

  // filter out the currencies we don't need and format the result
  const rates = currencyRates.reduce((acc, curr, index) => {
    const currency = currencies[index];
    const rate = Object.fromEntries(
      Object.entries(curr).filter(([key]) =>
        (resultCurrencies as ReadonlyArray<string>).includes(key)
      )
    );
    return { ...acc, [currency]: rate };
  }, {} as Record<Currency, Record<Currency, string>>);

  return rates;
};
