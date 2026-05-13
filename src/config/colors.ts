/**
 * Centralized color constants for the game logic and UI.
 * These should match the values defined in src/css/variables.css
 */

export const COLORS = {
  PRIMARY_RED: "#b52323",
  BLACK: "#000000",
  
  // Semantic mappings
  CLAN_TUGOAREGE: "#b52323",
  CLAN_ECERAE: "#000000",
} as const;

export type ColorType = typeof COLORS[keyof typeof COLORS];
