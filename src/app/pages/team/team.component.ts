import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TeamApiService } from '../../services/team.api.service';
import { TeamStoreService } from '../../services/team.store.service';
import { Team, Member } from '../../models';
import { MemberApiService } from '../../services/member.api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html'
})
export class TeamComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  private teamURL = new BehaviorSubject<string>('');
  private teamID: number;
  private team: Team;
  private teamCurrentMember: Member;

  constructor(
    private activatedRoute: ActivatedRoute,
    private teamApiService: TeamApiService,
    private memberApiService: MemberApiService,
    private teamStoreService: TeamStoreService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
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
            this.teamID = resp._id_team;
            this.teamStoreService.setTeam(resp);
          });
      }
    });

    // Get team data from store
    this.teamStoreService
      .getTeam()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((resp: Team) => {
        if (resp.hasOwnProperty('name')) {
          this.team = resp;
        }
      });

    // Get current user member data
    this.teamStoreService
      .currentTeamMember()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((resp: Member) => {
        this.teamCurrentMember = resp;
      });
  }

  ngOnDestroy(): void {
    this.teamStoreService.clearTeam();
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  /**
   * Leave curren team (delete member record from db)
   */
  onLeaveTeam(): void {
    this.memberApiService
      .deleteMember(this.authService.getUserID(), this.teamID)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((resp) => {
        this.router.navigate(['./app']);
      });
  }
}
