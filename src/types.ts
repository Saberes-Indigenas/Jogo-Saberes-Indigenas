export interface Vector2D {
  x: number;
  y: number;
}

export interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}
export type PulseState = {
  x: number;
  y: number;
  color: "correct" | "incorrect";
  key: number;
} | null;

export type ReturningItemState = {
  item: Item;
  startPos: { x: number; y: number };
  endPos: { x: number; y: number };
} | null;

export interface Clan {
  id: string; // ID único do clã (ex: "clan_paiwoe")
  name: string; // Nome do clã em português/identificador
  name_boe: string; // Nome original em Bororo
}
export interface Item {
  id: string; // ID único do item (ex: "item_anta")
  name: string; // Nome do item em português
  icon: string; // Emoji/ícone para representar o item
  correct_clan_id: string; // ID do clã ao qual o item pertence
  initial_pos: Vector2D; // Posição inicial no palco (usado quando já está no palco)
  color: string; // Cor de fundo do item (ex: "#b52323")
  clan: string; // Nome do clã (para exibição)
}

export interface GameData {
  clans: Clan[];
  items: Item[];
}
