import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subject, pipe } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TeamApiService } from '../../services/team.api.service';
import { Member } from '../../models';
import { MemberStoreService } from '../../services/member.store.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html'
})
export class TeamsComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  teams: Member[];
  isLoading: boolean;

  constructor(
    private teamApiService: TeamApiService,
    private memberStoreService: MemberStoreService
  ) {}

  ngOnInit() {
    // Start preloader
    this.isLoading = true;

    // Subscribe to membership store
    this.memberStoreService
      .getMemberships(1)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data: Member[]) => {
        this.teams = data;
      });

    // Get teams from API and set to store
    this.teamApiService
      .getTeams()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((resp) => {
        this.isLoading = false;
        this.memberStoreService.setMemberships(resp.resp);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
