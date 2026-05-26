import { and, eq, ne, notInArray, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, likes, matches, messages, profiles } from "../drizzle/schema";
import type { InsertProfile } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users (required by auth system) ────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  type TextField = (typeof textFields)[number];
  const assignNullable = (field: TextField) => {
    const value = user[field];
    if (value === undefined) return;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  };
  textFields.forEach(assignNullable);
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot get user: database not available"); return undefined; }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Profile ────────────────────────────────────────────────────────────────

function parseProfile(p: typeof profiles.$inferSelect) {
  return {
    ...p,
    photos: JSON.parse(p.photos || "[]") as string[],
    interests: JSON.parse(p.interests || "[]") as string[],
  };
}

export async function getProfile(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  if (!rows.length) return null;
  return parseProfile(rows[0]);
}

export async function getProfileByUserId(userId: number) {
  return getProfile(userId);
}

export async function createProfile(data: InsertProfile) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(profiles).values(data);
  return getProfile(data.userId);
}

export async function updateProfile(userId: number, data: Record<string, unknown>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(profiles).set(data as Partial<InsertProfile>).where(eq(profiles.userId, userId));
  return getProfile(userId);
}

// ─── Discover ───────────────────────────────────────────────────────────────

export async function getDiscoverProfiles(
  userId: number,
  opts: { minAge?: number; maxAge?: number; gender?: string; limit: number }
) {
  const db = await getDb();
  if (!db) return [];
  const swipedRows = await db.select({ toUserId: likes.toUserId }).from(likes).where(eq(likes.fromUserId, userId));
  const swipedIds = swipedRows.map((r) => r.toUserId);
  swipedIds.push(userId);
  const rows = await db
    .select()
    .from(profiles)
    .where(notInArray(profiles.userId, swipedIds))
    .limit(opts.limit);
  return rows.map(parseProfile);
}

// ─── Likes / Swipes ─────────────────────────────────────────────────────────

export async function swipe(fromUserId: number, toUserId: number, type: "like" | "superlike" | "nope") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(likes).values({ fromUserId, toUserId, type });
  if (type === "nope") return { matched: false };
  const mutual = await db
    .select()
    .from(likes)
    .where(and(eq(likes.fromUserId, toUserId), eq(likes.toUserId, fromUserId), or(eq(likes.type, "like"), eq(likes.type, "superlike"))))
    .limit(1);
  if (mutual.length > 0) {
    await db.insert(matches).values({ user1Id: Math.min(fromUserId, toUserId), user2Id: Math.max(fromUserId, toUserId) });
    return { matched: true };
  }
  return { matched: false };
}

export async function getWhoLikedMe(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(likes).where(and(eq(likes.toUserId, userId), or(eq(likes.type, "like"), eq(likes.type, "superlike"))));
}

// ─── Matches ────────────────────────────────────────────────────────────────

export async function getMatches(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(matches).where(or(eq(matches.user1Id, userId), eq(matches.user2Id, userId)));
  const enriched = await Promise.all(
    rows.map(async (m) => {
      const otherUserId = m.user1Id === userId ? m.user2Id : m.user1Id;
      const profile = await getProfile(otherUserId);
      const unreadCount = m.user1Id === userId ? m.unreadCount1 : m.unreadCount2;
      return { ...m, otherProfile: profile, unreadCount };
    })
  );
  return enriched.sort((a, b) => {
    const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : new Date(a.createdAt).getTime();
    const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : new Date(b.createdAt).getTime();
    return bTime - aTime;
  });
}

// ─── Messages ───────────────────────────────────────────────────────────────

export async function getMessages(userId: number, matchId: number, limit: number, offset: number) {
  const db = await getDb();
  if (!db) return [];
  const match = await db.select().from(matches).where(and(eq(matches.id, matchId), or(eq(matches.user1Id, userId), eq(matches.user2Id, userId)))).limit(1);
  if (!match.length) throw new Error("Match not found");
  return db.select().from(messages).where(eq(messages.matchId, matchId)).limit(limit).offset(offset);
}

export async function sendMessage(userId: number, matchId: number, text: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const matchRows = await db.select().from(matches).where(and(eq(matches.id, matchId), or(eq(matches.user1Id, userId), eq(matches.user2Id, userId)))).limit(1);
  if (!matchRows.length) throw new Error("Match not found");
  const match = matchRows[0];
  await db.insert(messages).values({ matchId, senderId: userId, text });
  const isUser1 = match.user1Id === userId;
  await db.update(matches).set({
    lastMessage: text,
    lastMessageAt: sql`NOW()`,
    unreadCount1: isUser1 ? 0 : sql`${matches.unreadCount1} + 1`,
    unreadCount2: isUser1 ? sql`${matches.unreadCount2} + 1` : 0,
  }).where(eq(matches.id, matchId));
  return { success: true };
}

export async function markMessagesRead(userId: number, matchId: number) {
  const db = await getDb();
  if (!db) return;
  const matchRows = await db.select().from(matches).where(eq(matches.id, matchId)).limit(1);
  if (!matchRows.length) return;
  const match = matchRows[0];
  const isUser1 = match.user1Id === userId;
  await db.update(matches).set(isUser1 ? { unreadCount1: 0 } : { unreadCount2: 0 }).where(eq(matches.id, matchId));
  await db.update(messages).set({ read: true }).where(and(eq(messages.matchId, matchId), ne(messages.senderId, userId)));
}

// ─── Premium ────────────────────────────────────────────────────────────────

export async function activatePremium(userId: number, plan: "premium" | "gold", months: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const until = new Date();
  until.setMonth(until.getMonth() + months);
  await db.update(profiles).set({
    isPremium: true,
    premiumPlan: plan,
    premiumUntil: until,
    swipesLeft: 9999,
    superLikesLeft: plan === "gold" ? 9999 : 5,
    boostsLeft: plan === "gold" ? 5 : 1,
  }).where(eq(profiles.userId, userId));
  return getProfile(userId);
}

export async function addBoosts(userId: number, quantity: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(profiles).set({ boostsLeft: sql`${profiles.boostsLeft} + ${quantity}` }).where(eq(profiles.userId, userId));
  return { success: true };
}

export async function addSuperLikes(userId: number, quantity: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(profiles).set({ superLikesLeft: sql`${profiles.superLikesLeft} + ${quantity}` }).where(eq(profiles.userId, userId));
  return { success: true };
}
