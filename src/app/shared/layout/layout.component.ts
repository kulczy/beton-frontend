import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MemberSocketService } from '../../services/member.socket.service';
import { MemberStoreService } from '../../services/member.store.service';
import { TeamApiService } from '../../services/team.api.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  isLoaded = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private teamApiService: TeamApiService,
    private memberStoreService: MemberStoreService,
    private memberSocketService: MemberSocketService
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
        this.isLoaded = true;
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
