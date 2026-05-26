import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "./_core/trpc";
import * as db from "./db";
import { storagePut } from "./storage";

export const appRouter = router({
  health: publicProcedure.query(() => ({ status: "ok" })),

  profile: router({
    get: protectedProcedure.query(({ ctx }) => {
      return db.getProfile(ctx.user.id);
    }),

    getById: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .query(({ input }) => {
        return db.getProfileByUserId(input.userId);
      }),

    create: protectedProcedure
      .input(z.object({
        displayName: z.string().min(1).max(100),
        birthDate: z.string(),
        gender: z.enum(["man", "woman", "nonbinary", "other"]),
        lookingFor: z.enum(["men", "women", "everyone"]),
        bio: z.string().max(300).optional(),
        photos: z.array(z.string()).min(1).max(6),
        interests: z.array(z.string()).max(10),
        city: z.string().max(100).optional(),
      }))
      .mutation(({ ctx, input }) => {
        return db.createProfile({
          userId: ctx.user.id,
          ...input,
          photos: JSON.stringify(input.photos),
          interests: JSON.stringify(input.interests),
        });
      }),

    update: protectedProcedure
      .input(z.object({
        displayName: z.string().min(1).max(100).optional(),
        bio: z.string().max(300).optional(),
        photos: z.array(z.string()).min(1).max(6).optional(),
        interests: z.array(z.string()).max(10).optional(),
        city: z.string().max(100).optional(),
        lookingFor: z.enum(["men", "women", "everyone"]).optional(),
      }))
      .mutation(({ ctx, input }) => {
        const data: Record<string, unknown> = { ...input };
        if (input.photos) data.photos = JSON.stringify(input.photos);
        if (input.interests) data.interests = JSON.stringify(input.interests);
        return db.updateProfile(ctx.user.id, data);
      }),

    uploadPhoto: protectedProcedure
      .input(z.object({
        base64: z.string(),
        mimeType: z.string(),
      }))
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.base64, "base64");
        const filename = `photo_${Date.now()}.jpg`;
        const result = await storagePut(`photos/${filename}`, buffer, input.mimeType);
        return { url: result.url };
      }),
  }),

  discover: router({
    getProfiles: protectedProcedure
      .input(z.object({
        minAge: z.number().min(18).max(100).optional(),
        maxAge: z.number().min(18).max(100).optional(),
        gender: z.enum(["men", "women", "everyone"]).optional(),
        limit: z.number().min(1).max(20).default(10),
      }))
      .query(({ ctx, input }) => {
        return db.getDiscoverProfiles(ctx.user.id, input);
      }),
  }),

  likes: router({
    swipe: protectedProcedure
      .input(z.object({
        toUserId: z.number(),
        type: z.enum(["like", "superlike", "nope"]),
      }))
      .mutation(({ ctx, input }) => {
        return db.swipe(ctx.user.id, input.toUserId, input.type);
      }),

    whoLikedMe: protectedProcedure.query(({ ctx }) => {
      return db.getWhoLikedMe(ctx.user.id);
    }),
  }),

  matches: router({
    list: protectedProcedure.query(({ ctx }) => {
      return db.getMatches(ctx.user.id);
    }),

    getMessages: protectedProcedure
      .input(z.object({
        matchId: z.number(),
        limit: z.number().min(1).max(50).default(30),
        offset: z.number().default(0),
      }))
      .query(({ ctx, input }) => {
        return db.getMessages(ctx.user.id, input.matchId, input.limit, input.offset);
      }),

    sendMessage: protectedProcedure
      .input(z.object({
        matchId: z.number(),
        text: z.string().min(1).max(1000),
      }))
      .mutation(({ ctx, input }) => {
        return db.sendMessage(ctx.user.id, input.matchId, input.text);
      }),

    markRead: protectedProcedure
      .input(z.object({ matchId: z.number() }))
      .mutation(({ ctx, input }) => {
        return db.markMessagesRead(ctx.user.id, input.matchId);
      }),
  }),

  premium: router({
    activate: protectedProcedure
      .input(z.object({
        plan: z.enum(["premium", "gold"]),
        months: z.number().min(1).max(12).default(1),
      }))
      .mutation(({ ctx, input }) => {
        return db.activatePremium(ctx.user.id, input.plan, input.months);
      }),

    purchaseBoost: protectedProcedure
      .input(z.object({ quantity: z.number().min(1).max(10) }))
      .mutation(({ ctx, input }) => {
        return db.addBoosts(ctx.user.id, input.quantity);
      }),

    purchaseSuperLikes: protectedProcedure
      .input(z.object({ quantity: z.number().min(1).max(50) }))
      .mutation(({ ctx, input }) => {
        return db.addSuperLikes(ctx.user.id, input.quantity);
      }),
  }),
});

export type AppRouter = typeof appRouter;
