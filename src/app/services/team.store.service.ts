import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Member, Team } from '../models';

@Injectable()
export class TeamStoreService {
  private team: BehaviorSubject<Team>;

  constructor() {
    this.team = new BehaviorSubject({});
  }

  getTeam(): BehaviorSubject<Team> {
    return this.team;
  }

  setTeam(team: Team): void {
    this.team.next(team);
  }
}
