import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subject, pipe } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TeamApiService } from '../../services/team.api.service';
import { TeamsStoreService } from '../../services/teams.store.service';
import { Member } from '../../models';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html'
})
export class TeamsComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  teams: Member[];
  isAllTeamsLoaded = true;

  constructor(
    private teamApiService: TeamApiService,
    private teamsStoreService: TeamsStoreService
  ) {}

  ngOnInit() {
    // Subscribe to teams store
    this.teamsStoreService
      .getTeams()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((teams: Member[]) => {
        this.teams = teams;
      });

    // Get teams from API
    this.teamApiService
      .getTeams('9', '', '1')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((resp) => {
        this.isAllTeamsLoaded = resp.resp.length >= resp.count ? true : false; // Check if all teams loaded
        this.teamsStoreService.setTeams(resp.resp);
      });
  }

  ngOnDestroy(): void {
    this.teamsStoreService.clearTeams();
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  /**
   * Load more teams to array
   */
  onLoadMoreTeams(): void {
    this.teamApiService
      .getTeams('9', this.teams.length, '1')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((resp) => {
        this.isAllTeamsLoaded =
          resp.resp.length + this.teams.length >= resp.count ? true : false; // Check if all teams loaded
        this.teamsStoreService.addTeams(resp.resp, false);
      });
  }
}
