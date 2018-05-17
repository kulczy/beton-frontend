import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Member } from '../../../models';
import { MemberApiService } from '../../../services/member.api.service';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html'
})
export class MembersListComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  @Input() members: Member[];

  constructor(private memberApiService: MemberApiService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onDeleteMember(_id_member: number, team_id: number): void {
    this.memberApiService
      .deleteMember(_id_member, team_id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((resp) => {
        console.log(resp);
      });
  }

  onUpdateMember(_id_member: number, id_team: number, is_admin: number): void {
    this.memberApiService
      .updateMember(_id_member, { id_team, is_admin })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((resp) => {
        console.log(resp);
      });
  }
}
