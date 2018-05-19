import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Member, Team } from '../models';
import { AuthService } from './auth.service';

@Injectable()
export class TeamStoreService {
  private team: BehaviorSubject<Team>;
  private teamCurrentMember: BehaviorSubject<Member>;
  private teamAllowAdminDelete: BehaviorSubject<boolean>;

  constructor(private authService: AuthService) {
    this.team = new BehaviorSubject({});
    this.teamCurrentMember = new BehaviorSubject({});
    this.teamAllowAdminDelete = new BehaviorSubject(false);

    // Subscribe to the team to get always fresh member data
    this.team.subscribe((team: Team) => {
      if (team.hasOwnProperty('name')) {
        // Find current user in team members
        const curr = team.members.find(
          (item: Member) => item.id_user === this.authService.getUserID()
        );
        this.teamCurrentMember.next(curr);

        // Check if there is more then 1 admin to allow admin removes
        const admins = team.members.filter(
          (item: Member) => item.is_admin === 1
        );
        if (admins.length > 1) {
          this.teamAllowAdminDelete.next(true);
        } else {
          this.teamAllowAdminDelete.next(false);
        }
      } else {
        this.teamCurrentMember.next({});
      }
    });
  }

  /**
   * Get teams
   */
  getTeam(): BehaviorSubject<Team> {
    return this.team;
  }

    /**
   * Return admins delete permission
   */
  allowAdminDelete(): BehaviorSubject<boolean> {
    return this.teamAllowAdminDelete;
  }

    /**
   * Get current team member
   */
  currentTeamMember(): BehaviorSubject<Member> {
    return this.teamCurrentMember;
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
    this.team.next({});
  }
}
