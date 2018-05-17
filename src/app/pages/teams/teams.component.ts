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
      .getTeams()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(resp => {
        this.teamsStoreService.setTeams(resp.resp);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
