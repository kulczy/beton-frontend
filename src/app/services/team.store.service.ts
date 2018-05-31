import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Member, Team, Game } from '../models';

@Injectable()
export class TeamStoreService {
  private team: BehaviorSubject<Team>;

  constructor(private authService: AuthService) {
    this.team = new BehaviorSubject(null);
  }

  /**
   * Get all team data
   */
  getTeam(): Observable<any> {
    return this.team.pipe(
      map((team: Team) => {
        // Current logged user membership data
        const currentMember: Member = team
          ? team.members.find((m) => m.id_user === this.authService.getUserID())
          : null;

        // Number of team admins
        const adminsLength: number = team
          ? team.members.filter((m: Member) => m.is_admin === 1).length
          : null;

        return { team, currentMember, adminsLength };
      })
    );
  }

  /**
   * Set new team
   * @param team
   */
  setTeam(team: Team): void {
    this.team.next(team);
  }

  /**
   * Clear team
   */
  clearTeam(): void {
    this.team.next(null);
  }

  /**
   * Return game by ID in team object
   * @param gameID
   */
  findGame(gameID): Game {
    const allGames = this.team.getValue().games;
    return allGames.find((x) => x._id_game === gameID);
  }

  /**
   * Add new member to team
   * @param member
   */
  addNewMember(member: Member): void {
    const team = this.team.getValue();
    team.members.push(member);
    this.team.next(team);
  }

  /**
   * Remove member from team object
   * @param userID
   */
  removeMember(userID): void {
    const team = this.team.getValue();
    const newMembers = team.members.filter((m) => m.id_user !== Number(userID));
    team.members = newMembers;
    this.team.next(team);
  }

  /**
   * Update member data
   * @param member
   */
  updateMemer(member: Member): void {
    const team = this.team.getValue();
    const i = team.members.findIndex((m) => m._id_member === member._id_member);
    if (i !== -1) {
      team.members[i] = Object.assign({}, team.members[i], member);
      this.team.next(team);
    }
  }
}
