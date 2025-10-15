// src/config/gameSession.ts

// Valor padrão de rodadas que pode ser ajustado conforme a jornada.
export const DEFAULT_MAX_ROUNDS = 5;

// Quantidade de plumas concedidas por rodada concluída.
export const FEATHERS_PER_ROUND = 1;

export const getFeatherCapacity = (rounds: number): number => {
  const normalizedRounds = Math.max(rounds, 0);
  const effectiveRounds =
    normalizedRounds > 0 ? normalizedRounds : DEFAULT_MAX_ROUNDS;
  return effectiveRounds * FEATHERS_PER_ROUND;
};
