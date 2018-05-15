import { Member } from './member.interface';

export interface User {
  _id_user?: number;
  created_at?: any;
  last_login?: any;
  username?: string;
  email?: string;
  photo?: string;
  public?: number;
  teams?: Member[];
}
