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
   * @param start add to begin or and of the array
   */
  addTeams(teams: Member[], start: boolean = true): void {
    if (start) {
      this.teams.next(teams.concat(this.teams.getValue()));
    } else {
      this.teams.next(this.teams.getValue().concat(teams));
    }
  }

  /**
   * Ovveride teams by adding new teams
   * @param teams
   */
  setTeams(teams: Member[]): void {
    this.teams.next(teams);
  }

  /**
   * Clear teams array
   */
  clearTeams(): void {
    this.teams.next([]);
  }
}
