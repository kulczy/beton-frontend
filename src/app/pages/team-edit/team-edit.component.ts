import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Member, Team } from '../../models';
import { UserApiService } from '../../services/user.api.service';
import { TeamStoreService } from '../../services/team.store.service';
import { MemberApiService } from '../../services/member.api.service';

@Component({
  selector: 'app-team-edit',
  templateUrl: './team-edit.component.html'
})
export class TeamEditComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  formControl: FormGroup;
  memberAddFormMsg: string;
  isLoading: boolean;
  team: Team;

  constructor(
    private fb: FormBuilder,
    private userApiService: UserApiService,
    private teamStoreService: TeamStoreService,
    private memberApiService: MemberApiService
  ) {}

  ngOnInit(): void {
    // Get team members data
    this.teamStoreService
      .getTeam()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((team: Team) => {
        if (team) {
          this.team = team;
        }
      });

    // Init form
    this.formControl = this.fb.group({
      email: ['', [Validators.email, Validators.required]]
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onSubmit(): void {
    if (this.formControl.valid) {
      this.memberApiService
        .addMember(this.team._id_team, this.formControl.controls.email.value)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((resp) => {
          this.memberAddFormMsg = resp.msg;
        });
    }
  }
}
