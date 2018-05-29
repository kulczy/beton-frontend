import { Component, OnInit, OnDestroy } from '@angular/core';
import { TeamStoreService } from '../../services/team.store.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Team, Type, Member } from '../../models';

@Component({
  selector: 'app-team-games',
  templateUrl: './team-games.component.html'
})
export class TeamGamesComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  team: Team;
  currentUser: Member;

  constructor(private teamStoreService: TeamStoreService) {}

  ngOnInit(): void {
    // Get team data from store
    this.teamStoreService
      .getTeam()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((resp: Team) => {
        if (resp.hasOwnProperty('name')) {
          this.team = resp;
        }
      });

    // Get current user/member object
    this.teamStoreService
      .currentTeamMember()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((resp) => {
        if (resp.hasOwnProperty('_id_member')) {
          this.currentUser = resp;
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
