import { Type } from '.';

export interface Game {
  _id_game?: number;
  created_at?: any;
  updated_at?: any;
  creator_id?: number;
  close_at?: any;
  id_team?: number;
  player_a?: string;
  player_b?: string;
  score_a?: number;
  score_b?: number;
}
