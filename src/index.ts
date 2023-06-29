import cron from "node-cron";

import { getExchageRates } from "./utils/rates.js";
import { db } from "./db/db.js";
import { rates } from "./db/schema.js";

// every minute
cron.schedule("* * * * *", async () => {
  const r = await getExchageRates();
  await db.insert(rates).values(r).run();
});
