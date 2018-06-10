import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MemberSocketService } from '../../services/member.socket.service';
import { MemberStoreService } from '../../services/member.store.service';
import { TeamApiService } from '../../services/team.api.service';
import { takeUntil, delay } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserApiService } from '../../services/user.api.service';
import { User } from '../../models';
import { UserStoreService } from '../../services/user.store.service';
import { AppInfoService } from '../../services/appinfo.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  isLoadedMembership = false;
  isLoadedUser = false;
  breadcrumbs = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private teamApiService: TeamApiService,
    private userApiService: UserApiService,
    private userStoreService: UserStoreService,
    private memberStoreService: MemberStoreService,
    private memberSocketService: MemberSocketService,
    private appinfoService: AppInfoService
  ) {}

  ngOnInit(): void {
    // Get team invites for current user (is_member = 0) to use in notification,
    // set it to the store, and connect to sockets.
    // This API request is required only for get invites (is_member = 0)
    // to display in notification even if user start exploring app from route
    // different then 'games', which query all user memberships
    this.teamApiService
      .getTeams('', '', '0')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((resp) => {
        this.memberStoreService.setMemberships(resp.resp);
        this.memberSocketService.socketConnect();
        this.isLoadedMembership = true;
      });

    // Get user data from API and send to store
    this.userApiService
      .getUserByID(this.authService.getUserID())
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((resp: User) => {
        this.userStoreService.setUser(resp);
        this.isLoadedUser = true;
      });

    // Get breadcrumps
    this.appinfoService
      .getBreadcrumps()
      .pipe(
        takeUntil(this.unsubscribe),
        delay(10)
      )
      .subscribe((resp) => {
        this.breadcrumbs = resp;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.memberSocketService.socketDisconnect();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
