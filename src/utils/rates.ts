import { NewRate, Rate } from "../db/schema.js";
import {
  CRYPTO_CURRENCIES,
  Currency,
  FIAT_CURRENCIES,
  isFiatCurrency,
  isCryptoCurrency,
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

export const convertToObj = (arr: Rate[]) => {
  const res: Record<string, Record<string, string>> = {};
  for (const row of arr) {
    if (!res[row.base_currency]) {
      res[row.base_currency] = {};
    }
    res[row.base_currency][row.target_currency] = row.rate;
  }
  return res;
};

export const validateCurrencyParamsPair = (base: string, target: string) => {
  if (
    (isFiatCurrency(base) && isFiatCurrency(target)) ||
    (isCryptoCurrency(base) && isCryptoCurrency(target))
  ) {
    return false;
  }
  return true;
};
