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

export interface Clan {
  id: string;
  name: string;
  name_boe: string;
  targetArea: Area;
}

export interface Item {
  id: string;
  name: string;
  image_path: string;
  audio_path: string;
  correct_clan_id: string;
  initial_pos: Vector2D;
  color: string;
}

export interface GameData {
  clans: Clan[];
  items: Item[];
}