import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Member } from '../models';

@Injectable()
export class TeamsStoreService {
  private teams: BehaviorSubject<Member[]>;

  constructor() {
    this.teams = new BehaviorSubject([]);
  }

  /**
   * Return teams data
   */
  getTeams(): BehaviorSubject<Member[]> {
    return this.teams;
  }

  /**
   * Add team to array
   * @param teams
   */
  addTeams(teams: Member[]): void {
    this.teams.next(teams.concat(this.teams.getValue()));
  }

  /**
   * Ovveride teams by adding new teams
   * @param teams
   */
  setTeams(teams: Member[]): void {
    this.teams.next(teams);
  }
}
