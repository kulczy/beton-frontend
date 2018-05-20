import { Member } from './member.interface';

export interface User {
  _id_user?: number;
  created_at?: any;
  updated_at?: any;
  facebook_id?: any;
  username?: string;
  email?: string;
  photo?: string;
  is_public?: number;
  teams?: Member[];
}
