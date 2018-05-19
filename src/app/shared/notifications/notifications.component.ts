import { Component, OnInit, OnDestroy } from '@angular/core';
import { TeamApiService } from '../../services/team.api.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Member } from '../../models';
import { MemberApiService } from '../../services/member.api.service';
import { TeamsStoreService } from '../../services/teams.store.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html'
})
export class NotificationsComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  teams: Member[];

  constructor(
    private teamApiService: TeamApiService,
    private memberApiService: MemberApiService,
    private teamsStoreService: TeamsStoreService
  ) {}

  ngOnInit(): void {
    // Get teams from API
    this.teamApiService
      .getTeams('', '', '0')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((resp) => {
        this.teams = resp.resp;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  /**
   * Accept infite - set is_member to 1
   * @param memberID
   * @param id_team
   */
  onAcceptInvite(memberID: number, id_team: number): void {
    this.memberApiService
      .updateMember(memberID, { id_team, is_member: 1, join_at: 1 })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((resp) => {
        // Add member to team store
        const selectTeam = this.teams.find(
          (elem) => elem._id_member === memberID
        );
        selectTeam.is_member = 1;
        this.teamsStoreService.addTeams([selectTeam]);
        // Remove member data from array
        this.teams = this.removeMemberFromArray(this.teams, memberID);
      });
  }

  /**
   * Delete membership
   * @param memberID
   * @param userID
   * @param teamID
   */
  onRejectInvite(memberID: number, userID: number, teamID: number): void {
    this.memberApiService
      .deleteMember(userID, teamID)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((resp) => {
        this.teams = this.removeMemberFromArray(this.teams, memberID); // Remove member data from array
      });
  }

  /**
   * Remove member from teams array and return new teams array
   * @param teams teams array
   * @param memberID
   */
  private removeMemberFromArray(teams: Member[], memberID: number): Member[] {
    const newTeams = this.teams.splice(0); // Clone teams
    const i = newTeams.findIndex((elem) => elem._id_member === memberID); // Find index of member to remove
    newTeams.splice(i, 1);
    return newTeams;
  }
}
