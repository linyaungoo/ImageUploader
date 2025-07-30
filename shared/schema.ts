import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const lotteryResults = pgTable("lottery_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  drawTime: text("draw_time").notNull(), // e.g., "12:01 PM"
  drawDate: text("draw_date").notNull(), // e.g., "2025-07-30"
  resultType: text("result_type").notNull(), // "2D" or "3D"
  set: text("set"), // SET value like "1,205.27"
  value: text("value"), // Value like "23,339.30"
  result2D: text("result_2d"), // 2D result like "79"
  modern: text("modern"), // Modern value like "01"
  internet: text("internet"), // Internet value like "76" 
  tw: text("tw"), // TW value like "60"
  isLoading: boolean("is_loading").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const appSettings = pgTable("app_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  currentView: text("current_view").notNull().default("2D"), // "2D" or "3D"
  lastUpdate: timestamp("last_update").defaultNow(),
  totalDrawsToday: integer("total_draws_today").default(0),
});

export const insertLotteryResultSchema = createInsertSchema(lotteryResults).omit({
  id: true,
  createdAt: true,
});

export const insertAppSettingsSchema = createInsertSchema(appSettings).omit({
  id: true,
  lastUpdate: true,
});

export type InsertLotteryResult = z.infer<typeof insertLotteryResultSchema>;
export type LotteryResult = typeof lotteryResults.$inferSelect;
export type InsertAppSettings = z.infer<typeof insertAppSettingsSchema>;
export type AppSettings = typeof appSettings.$inferSelect;
