import * as StoreReview from "expo-store-review";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Tipos de productos disponibles en GoChat
 */
export const IAP_PRODUCTS = {
  // Suscripciones
  PREMIUM_MONTHLY: "com.gochat.premium.monthly",
  GOLD_MONTHLY: "com.gochat.gold.monthly",

  // Consumibles
  BOOST_1: "com.gochat.boost.1",
  BOOST_5: "com.gochat.boost.5",
  SUPER_LIKES_10: "com.gochat.superlikes.10",
  REWINDS_5: "com.gochat.rewinds.5",
};

/**
 * Información de precios y características de cada producto
 */
export const PRODUCT_INFO = {
  [IAP_PRODUCTS.PREMIUM_MONTHLY]: {
    name: "Premium",
    price: "$9.99",
    priceUSD: 9.99,
    currency: "USD",
    period: "month",
    description: "Acceso ilimitado a swipes, 5 super likes diarios y más",
    features: [
      "Swipes ilimitados",
      "5 Super Likes por día",
      "Ver quién te gustó",
      "Filtros avanzados",
      "1 Boost por mes",
      "Rewind (deshacer)",
    ],
  },
  [IAP_PRODUCTS.GOLD_MONTHLY]: {
    name: "Gold",
    price: "$19.99",
    priceUSD: 19.99,
    currency: "USD",
    period: "month",
    description: "Acceso VIP con todas las características premium",
    features: [
      "Swipes ilimitados",
      "Super Likes ilimitados",
      "Ver quién te gustó",
      "Filtros avanzados",
      "5 Boosts por mes",
      "Rewind ilimitado",
      "Modo Invisible",
    ],
  },
  [IAP_PRODUCTS.BOOST_1]: {
    name: "1 Boost",
    price: "$1.99",
    priceUSD: 1.99,
    currency: "USD",
    description: "Aparece primero en búsquedas durante 30 minutos",
  },
  [IAP_PRODUCTS.BOOST_5]: {
    name: "5 Boosts",
    price: "$7.99",
    priceUSD: 7.99,
    currency: "USD",
    description: "5 Boosts - Ahorra 20%",
  },
  [IAP_PRODUCTS.SUPER_LIKES_10]: {
    name: "10 Super Likes",
    price: "$4.99",
    priceUSD: 4.99,
    currency: "USD",
    description: "10 Super Likes para mostrar interés especial",
  },
  [IAP_PRODUCTS.REWINDS_5]: {
    name: "5 Rewinds",
    price: "$2.99",
    priceUSD: 2.99,
    currency: "USD",
    description: "5 Rewinds para deshacer tus últimos swipes",
  },
};

/**
 * Tipos de suscripción
 */
export type SubscriptionType = "none" | "premium" | "gold";

/**
 * Información de suscripción del usuario
 */
export interface UserSubscription {
  type: SubscriptionType;
  expiresAt: number | null;
  isActive: boolean;
  autoRenews: boolean;
}

/**
 * Información de consumibles del usuario
 */
export interface UserConsumables {
  boosts: number;
  superLikes: number;
  rewinds: number;
}

/**
 * Obtener suscripción del usuario desde AsyncStorage
 */
export async function getUserSubscription(): Promise<UserSubscription> {
  try {
    const data = await AsyncStorage.getItem("user_subscription");
    if (!data) {
      return { type: "none", expiresAt: null, isActive: false, autoRenews: false };
    }
    const subscription = JSON.parse(data);
    return {
      ...subscription,
      isActive: subscription.expiresAt ? subscription.expiresAt > Date.now() : false,
    };
  } catch (error) {
    console.error("Error getting subscription:", error);
    return { type: "none", expiresAt: null, isActive: false, autoRenews: false };
  }
}

/**
 * Guardar suscripción del usuario
 */
export async function saveUserSubscription(subscription: UserSubscription): Promise<void> {
  try {
    await AsyncStorage.setItem("user_subscription", JSON.stringify(subscription));
  } catch (error) {
    console.error("Error saving subscription:", error);
  }
}

/**
 * Obtener consumibles del usuario
 */
export async function getUserConsumables(): Promise<UserConsumables> {
  try {
    const data = await AsyncStorage.getItem("user_consumables");
    if (!data) {
      return { boosts: 0, superLikes: 0, rewinds: 0 };
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Error getting consumables:", error);
    return { boosts: 0, superLikes: 0, rewinds: 0 };
  }
}

/**
 * Guardar consumibles del usuario
 */
export async function saveUserConsumables(consumables: UserConsumables): Promise<void> {
  try {
    await AsyncStorage.setItem("user_consumables", JSON.stringify(consumables));
  } catch (error) {
    console.error("Error saving consumables:", error);
  }
}

/**
 * Agregar consumibles
 */
export async function addConsumables(
  boosts: number = 0,
  superLikes: number = 0,
  rewinds: number = 0
): Promise<UserConsumables> {
  const current = await getUserConsumables();
  const updated = {
    boosts: Math.max(0, current.boosts + boosts),
    superLikes: Math.max(0, current.superLikes + superLikes),
    rewinds: Math.max(0, current.rewinds + rewinds),
  };
  await saveUserConsumables(updated);
  return updated;
}

/**
 * Usar consumible
 */
export async function useConsumable(type: "boosts" | "superLikes" | "rewinds"): Promise<boolean> {
  const current = await getUserConsumables();
  if (current[type] <= 0) return false;

  const updated = { ...current, [type]: current[type] - 1 };
  await saveUserConsumables(updated);
  return true;
}

/**
 * Simular compra de suscripción (para testing)
 */
export async function simulatePurchaseSubscription(
  productId: string
): Promise<{ success: boolean; subscription?: UserSubscription }> {
  try {
    let subscription: UserSubscription;

    if (productId === IAP_PRODUCTS.PREMIUM_MONTHLY) {
      subscription = {
        type: "premium",
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 días
        isActive: true,
        autoRenews: true,
      };
    } else if (productId === IAP_PRODUCTS.GOLD_MONTHLY) {
      subscription = {
        type: "gold",
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 días
        isActive: true,
        autoRenews: true,
      };
    } else {
      return { success: false };
    }

    await saveUserSubscription(subscription);
    return { success: true, subscription };
  } catch (error) {
    console.error("Error simulating purchase:", error);
    return { success: false };
  }
}

/**
 * Simular compra de consumible (para testing)
 */
export async function simulatePurchaseConsumable(
  productId: string
): Promise<{ success: boolean; consumables?: UserConsumables }> {
  try {
    let consumables: UserConsumables | null = null;

    if (productId === IAP_PRODUCTS.BOOST_1) {
      consumables = await addConsumables(1, 0, 0);
    } else if (productId === IAP_PRODUCTS.BOOST_5) {
      consumables = await addConsumables(5, 0, 0);
    } else if (productId === IAP_PRODUCTS.SUPER_LIKES_10) {
      consumables = await addConsumables(0, 10, 0);
    } else if (productId === IAP_PRODUCTS.REWINDS_5) {
      consumables = await addConsumables(0, 0, 5);
    }

    if (!consumables) return { success: false };

    return { success: true, consumables };
  } catch (error) {
    console.error("Error simulating consumable purchase:", error);
    return { success: false };
  }
}

/**
 * Cancelar suscripción
 */
export async function cancelSubscription(): Promise<void> {
  try {
    await saveUserSubscription({ type: "none", expiresAt: null, isActive: false, autoRenews: false });
  } catch (error) {
    console.error("Error canceling subscription:", error);
  }
}

/**
 * Verificar si el usuario tiene acceso premium
 */
export async function hasPremiumAccess(): Promise<boolean> {
  const subscription = await getUserSubscription();
  return subscription.isActive && (subscription.type === "premium" || subscription.type === "gold");
}

/**
 * Verificar si el usuario tiene acceso gold
 */
export async function hasGoldAccess(): Promise<boolean> {
  const subscription = await getUserSubscription();
  return subscription.isActive && subscription.type === "gold";
}

/**
 * Obtener días restantes de suscripción
 */
export async function getDaysRemaining(): Promise<number> {
  const subscription = await getUserSubscription();
  if (!subscription.expiresAt || !subscription.isActive) return 0;

  const daysRemaining = Math.ceil((subscription.expiresAt - Date.now()) / (24 * 60 * 60 * 1000));
  return Math.max(0, daysRemaining);
}
