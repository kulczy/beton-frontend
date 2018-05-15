import { Team, User } from '.';

export interface Member {
  _id_member?: number;
  invited_at?: any;
  updated_at?: any;
  id_team?: number;
  id_user?: number;
  is_member?: number;
  is_admin?: number;
  is_creator?: number;
  team?: Team;
}
