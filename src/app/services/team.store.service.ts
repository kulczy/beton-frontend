import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Member } from '../models';

@Injectable()
export class TeamStoreService {
  private teams: BehaviorSubject<Member[]>;

  constructor() {
    this.teams = new BehaviorSubject([]);
  }

  getTeams(): BehaviorSubject<Member[]> {
    return this.teams;
  }

  setTeams(teams: Member[]): void {
    this.teams.next(teams.concat(this.teams.getValue()));
  }
}
