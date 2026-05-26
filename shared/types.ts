export type Gender = "man" | "woman" | "nonbinary" | "other";
export type LookingFor = "men" | "women" | "everyone";
export type PremiumPlan = "none" | "premium" | "gold";
export type SwipeType = "like" | "superlike" | "nope";

export interface UserProfile {
  id: number;
  userId: number;
  displayName: string;
  birthDate: string;
  gender: Gender;
  lookingFor: LookingFor;
  bio: string | null;
  photos: string[];
  interests: string[];
  city: string | null;
  isPremium: boolean;
  premiumPlan: PremiumPlan;
  swipesLeft: number;
  superLikesLeft: number;
  boostsLeft: number;
}

export interface MatchWithProfile {
  id: number;
  user1Id: number;
  user2Id: number;
  lastMessage: string | null;
  lastMessageAt: Date | null;
  unreadCount: number;
  otherProfile: UserProfile | null;
  createdAt: Date;
}

export interface ChatMessage {
  id: number;
  matchId: number;
  senderId: number;
  text: string;
  read: boolean;
  createdAt: Date;
}

export const INTERESTS = [
  "Música", "Viajes", "Deportes", "Cine", "Gaming",
  "Cocina", "Arte", "Lectura", "Fotografía", "Fitness",
  "Tecnología", "Moda", "Naturaleza", "Baile", "Yoga",
  "Mascotas", "Senderismo", "Meditación", "Voluntariado", "Teatro",
];
