import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, BehaviorSubject, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TeamApiService } from '../../services/team.api.service';
import { TeamStoreService } from '../../services/team.store.service';
import { Team, Member } from '../../models';
import { MemberApiService } from '../../services/member.api.service';
import { AuthService } from '../../services/auth.service';
import { TeamSocketService } from '../../services/team.socket.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html'
})
export class TeamComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  private teamURL = new ReplaySubject<string>(null);
  private team: Team;
  private currentMember: Member;

  constructor(
    private activatedRoute: ActivatedRoute,
    private teamApiService: TeamApiService,
    private memberApiService: MemberApiService,
    private teamStoreService: TeamStoreService,
    private authService: AuthService,
    private router: Router,
    private teamSocketService: TeamSocketService
  ) {}

  ngOnInit(): void {
    // Get team url from url params
    this.activatedRoute.params
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((params: Params) => {
        this.teamURL.next(params.url);
      });

    // Get team data from api
    this.teamURL.pipe(takeUntil(this.unsubscribe)).subscribe((url: string) => {
      this.teamApiService
        .getTeamFull(url)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((resp: Team) => {
          this.teamStoreService.setTeam(resp); // Set team to store
          this.teamSocketService.socketConnect(resp._id_team); // Connect to socket
        });
    });

    // Get team data from store
    this.teamStoreService
      .getTeam()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((resp) => {
        // Leave team if current user not exist
        if (resp.team && !resp.currentMember) {
          this.router.navigate(['./app']);
        }
        // Set variables
        this.team = resp.team;
        this.currentMember = resp.currentMember;
      });
  }

  ngOnDestroy(): void {
    this.teamSocketService.socketDisconnect();
    this.teamStoreService.clearTeam();
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  /**
   * Leave current team (delete member record from db)
   */
  onLeaveTeam(): void {
    this.memberApiService
      .deleteMember(this.authService.getUserID(), this.team._id_team)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((resp) => {
        console.log(`you leave ${this.team.name} team`);
      });
  }
}
