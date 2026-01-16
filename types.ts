export interface Treasure {
  id: string;
  emoji: string;
  name: string;
  color: string;
}

export enum GameState {
  START,
  PLAYING,
  GAME_OVER,
  VICTORY
}

export interface ScoreData {
  current: number;
  best: number;
}
