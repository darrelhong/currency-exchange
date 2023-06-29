import { NewRate } from "../db/schema.js";
import {
  CRYPTO_CURRENCIES,
  Currency,
  FIAT_CURRENCIES,
  isFiatCurrency,
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

export const getExchageRates = async () => {
  const currencies = [...CRYPTO_CURRENCIES, ...FIAT_CURRENCIES];

  // fetch exchange rates from coinbase API in parallel
  const currencyRates = await Promise.all(
    currencies.map((currency) => getCoinbaseRate({ baseCurrency: currency }))
  );

  // format rates into array of objects with base currency and target currency and rate
  let result: NewRate[] = [];

  for (const [index, ratesObj] of currencyRates.entries()) {
    const baseCurrency = currencies[index];

    // keep only fiat values if the currency is crypto, and vice versa
    const resultCurrencies = isFiatCurrency(baseCurrency)
      ? CRYPTO_CURRENCIES
      : FIAT_CURRENCIES;

    for (const [targetCurrency, rate] of Object.entries(ratesObj)) {
      if (
        (resultCurrencies as ReadonlyArray<string>).includes(targetCurrency)
      ) {
        result.push({
          base_currency: baseCurrency,
          target_currency: targetCurrency,
          rate,
        });
      }
    }
  }

  return result;
};
