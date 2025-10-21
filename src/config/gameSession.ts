// src/config/gameSession.ts

// Valor padrão de rodadas que pode ser ajustado conforme a jornada.
export const DEFAULT_MAX_ROUNDS = 5;

// Quantidade necessária de acertos consecutivos para conquistar uma nova pluma.
export const FEATHER_STREAK_REQUIREMENT = 4;

// Recompensa base de sementes de urucum por acerto correto.
export const URUCUM_SEED_BASE_REWARD = 10;

// Multiplicador aplicado à recompensa de sementes para cada pluma conquistada.
export const FEATHER_REWARD_MULTIPLIER = 2;

export const getFeatherCapacity = (totalDeliveries: number): number => {
  const normalizedDeliveries = Math.max(totalDeliveries, 0);
  if (normalizedDeliveries === 0) {
    return 0;
  }

  return Math.floor(normalizedDeliveries / FEATHER_STREAK_REQUIREMENT);
};

export const calculateMaxUrucumSeeds = (totalDeliveries: number): number => {
  const normalizedDeliveries = Math.max(totalDeliveries, 0);

  let feathers = 0;
  let totalSeeds = 0;

  for (let deliveryIndex = 0; deliveryIndex < normalizedDeliveries; deliveryIndex += 1) {
    const deliveryPosition = deliveryIndex + 1;
    totalSeeds +=
      URUCUM_SEED_BASE_REWARD *
      Math.pow(FEATHER_REWARD_MULTIPLIER, Math.max(feathers, 0));

    if (deliveryPosition % FEATHER_STREAK_REQUIREMENT === 0) {
      feathers += 1;
    }
  }

  return totalSeeds;
};
