import cron from "node-cron";
import express from "express";
import { and, between, eq, sql } from "drizzle-orm";

import {
  convertToObj,
  getExchageRates,
  validateCurrencyParamsPair,
} from "./utils/rates.js";
import { db } from "./db/db.js";
import { Rate, rates } from "./db/schema.js";
import {
  CRYPTO_CURRENCIES,
  FIAT_CURRENCIES,
  isCurrencyType,
} from "./types/rates.js";

// every minute
cron.schedule("* * * * *", async () => {
  const r = await getExchageRates();
  await db.insert(rates).values(r).run();
});

const app = express();

app.get("/exchange-rates", async (req, res) => {
  const base = (req.query.base || "crypto") as string;
  
  // check base is valid currencytype
  if (isCurrencyType(base)) {
    const selectedCurrencies =
      base === "crypto" ? CRYPTO_CURRENCIES : FIAT_CURRENCIES;

    // todo: build query with drizzle instead
    const result: Rate[] = await db.all(sql`
        SELECT r1.base_currency, r1.target_currency, r1.rate
        FROM rates r1
        JOIN (
          SELECT base_currency, target_currency, MAX(created_at) AS latest
          FROM rates
          GROUP BY base_currency, target_currency
        ) r2
        ON r1.base_currency = r2.base_currency
        AND r1.target_currency = r2.target_currency
        AND r1.created_at = r2.latest
        WHERE r1.base_currency IN (${sql.join(
          selectedCurrencies.slice(),
          sql`, `
        )})
       `);

    res.json(convertToObj(result));
  } else {
    res.status(400).json({ error: "Invalid base currency" });
  }
});

app.get("/historical-rates", async (req, res) => {
  const {
    base_currency,
    target_currency,
    start,
    end = Date.now(),
  }: {
    base_currency?: string;
    target_currency?: string;
    start?: number;
    end?: number;
  } = req.query;

  if (
    base_currency &&
    target_currency &&
    start &&
    validateCurrencyParamsPair(base_currency, target_currency as string)
  ) {
    const result = await db
      .select({
        value: rates.rate,
        timestamp: sql`unixepoch(rates.created_at) * 1000`,
      })
      .from(rates)
      .where(
        and(
          eq(rates.base_currency, base_currency),
          eq(rates.target_currency, target_currency),
          between(
            rates.created_at,
            sql<string>`datetime(${start / 1000}, 'unixepoch')`,
            sql<string>`datetime(${end / 1000}, 'unixepoch')`
          )
        )
      )
      .orderBy(rates.created_at)
      .all();

    res.json(result);
  } else {
    res.status(400).json({ error: "Invalid parameters" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
