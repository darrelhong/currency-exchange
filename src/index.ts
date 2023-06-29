import cron from "node-cron";

import { getExchageRates } from "./utils/rates.js";

cron.schedule("* * * * *", () => {
  console.log("running a task every minute");
});

const r = await getExchageRates({ currencyType: "fiat" });

console.log(r)