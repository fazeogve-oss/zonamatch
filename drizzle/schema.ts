import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const profiles = mysqlTable("profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  displayName: varchar("displayName", { length: 100 }).notNull(),
  birthDate: varchar("birthDate", { length: 20 }).notNull(),
  gender: mysqlEnum("gender", ["man", "woman", "nonbinary", "other"]).notNull(),
  lookingFor: mysqlEnum("lookingFor", ["men", "women", "everyone"]).default("everyone").notNull(),
  bio: text("bio"),
  photos: varchar("photos", { length: 2000 }).notNull().default("[]"), // JSON array of photo URLs
  interests: varchar("interests", { length: 1000 }).notNull().default("[]"), // JSON array of interest strings
  city: varchar("city", { length: 100 }),
  isPremium: boolean("isPremium").default(false).notNull(),
  premiumPlan: mysqlEnum("premiumPlan", ["none", "premium", "gold"]).default("none").notNull(),
  premiumUntil: timestamp("premiumUntil"),
  swipesLeft: int("swipesLeft").default(20).notNull(),
  superLikesLeft: int("superLikesLeft").default(1).notNull(),
  boostsLeft: int("boostsLeft").default(0).notNull(),
  lastSwipeReset: timestamp("lastSwipeReset").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const likes = mysqlTable("likes", {
  id: int("id").autoincrement().primaryKey(),
  fromUserId: int("fromUserId").notNull(),
  toUserId: int("toUserId").notNull(),
  type: mysqlEnum("type", ["like", "superlike", "nope"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const matches = mysqlTable("matches", {
  id: int("id").autoincrement().primaryKey(),
  user1Id: int("user1Id").notNull(),
  user2Id: int("user2Id").notNull(),
  lastMessage: text("lastMessage"),
  lastMessageAt: timestamp("lastMessageAt"),
  unreadCount1: int("unreadCount1").default(0).notNull(), // unread for user1
  unreadCount2: int("unreadCount2").default(0).notNull(), // unread for user2
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  matchId: int("matchId").notNull(),
  senderId: int("senderId").notNull(),
  text: text("text").notNull(),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;
export type Like = typeof likes.$inferSelect;
export type Match = typeof matches.$inferSelect;
export type Message = typeof messages.$inferSelect;
