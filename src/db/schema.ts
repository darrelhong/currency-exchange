import { InferModel, sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const rates = sqliteTable("rates", {
  id: integer("id").primaryKey(),
  base_currency: text("base_currency").notNull(),
  target_currency: text("target_currency").notNull(),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  rate: text("rate").notNull(),
});

export type NewRate = InferModel<typeof rates, "insert">;
