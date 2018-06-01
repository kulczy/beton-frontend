import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models';

@Injectable()
export class UserStoreService {
  private user: BehaviorSubject<User>;

  constructor() {
    this.user = new BehaviorSubject(null);
  }

  /**
   * Set new user
   * @param user
   */
  setUser(user: User): void {
    this.user.next(user);
  }

  /**
   * Return user
   */
  getUser(): BehaviorSubject<User> {
    return this.user;
  }

  /**
   * Update user data
   * @param newUser
   */
  updateUser(newUser: User): void {
    const user = this.user.getValue();
    const u = Object.assign({}, user, newUser);
    this.user.next(u);
  }
}
