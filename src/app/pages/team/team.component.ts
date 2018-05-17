import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TeamApiService } from '../../services/team.api.service';
import { TeamStoreService } from '../../services/team.store.service';
import { Team } from '../../models';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html'
})
export class TeamComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  private teamURL = new BehaviorSubject<string>('');

  constructor(
    private activatedRoute: ActivatedRoute,
    private teamApiService: TeamApiService,
    private teamStoreService: TeamStoreService
  ) {
    // Get team url from url params
    this.activatedRoute.params
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((params: Params) => {
        this.teamURL.next(params.url);
      });

    // Get team data from api
    this.teamURL.subscribe((url) => {
      if (url.length) {
        this.teamApiService
          .getTeamFull(url)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe((resp: Team) => {
            this.teamStoreService.setTeam(resp);
          });
      }
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
