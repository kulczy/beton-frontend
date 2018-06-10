import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Member, Team } from '../../../models';
import { MemberApiService } from '../../../services/member.api.service';
import { TeamStoreService } from '../../../services/team.store.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html'
})
export class MembersListComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  @Input() team: Team;
  @Input() allowAdminDelete: boolean;
  formControl: FormGroup; // Member add form
  memberAddFormMsg: string; // Message text after add member
  isLoading: boolean;

  constructor(
    private fb: FormBuilder,
    private memberApiService: MemberApiService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertSevice: AlertService
  ) {}

  ngOnInit(): void {
    // Init form
    this.formControl = this.fb.group({
      email: ['', [Validators.email, Validators.required]]
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  /**
   * Delete member from the team
   * @param id_user
   * @param id_team
   */
  onDeleteMember(id_user: number, id_team: number): void {
    const conf = confirm('Are you sure you want to remove the member?');
    if (conf === true) {
      this.memberApiService
        .deleteMember(id_user, id_team)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((resp) => {
          this.alertSevice.showAlert('memberRemoved');
        });
    }
  }

  /**
   * Change member is_admin permission
   * @param _id_member
   * @param id_team
   * @param is_admin
   */
  onUpdateMember(
    _id_member: number,
    id_team: number,
    is_admin: number,
    id_user: number
  ): void {
    this.memberApiService
      .updateMember(_id_member, { id_team, is_admin })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((resp) => {
        this.alertSevice.showAlert('memberAdminUpdated');
        if (is_admin === 0 && id_user === this.authService.getUserID()) {
          this.router.navigate(['../'], { relativeTo: this.activatedRoute });
        }
      });
  }

  /**
   * Add new member
   */
  onAddMember(): void {
    if (this.formControl.valid) {
      this.isLoading = true;
      this.memberApiService
        .addMember(
          this.team._id_team,
          this.formControl.controls.email.value,
          this.authService.getUserID()
        )
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((resp) => {
          this.isLoading = false;
          // Display message
          this.memberAddFormMsg = resp.msg;

          // Clear form
          this.formControl.patchValue({
            email: ''
          });
        });
    }
  }
}
