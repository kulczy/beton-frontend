import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Member } from '../../models';
import { MemberApiService } from '../../services/member.api.service';
import { MemberStoreService } from '../../services/member.store.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html'
})
export class NotificationsComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  members: Member[];

  constructor(
    private memberApiService: MemberApiService,
    private memberStoreService: MemberStoreService
  ) {}

  ngOnInit(): void {
    // Get memberships from store
    this.memberStoreService
      .getMemberships(0)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((resp) => {
        this.members = resp;
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
        console.log('memberships accept');
      });
  }

  /**
   * Delete membership
   * @param memberID
   * @param userID
   * @param teamID
   */
  onRejectInvite(userID: number, teamID: number): void {
    this.memberApiService
      .deleteMember(userID, teamID)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((resp) => {
        console.log('memberships delete from DB');
      });
  }
}
