import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Team } from '../../../models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { TeamApiService } from '../../../services/team.api.service';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TeamStoreService } from '../../../services/team.store.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-team-edit-card',
  templateUrl: './team-edit-card.component.html'
})
export class TeamEditCardComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  @Input() team: Team;
  formControl: FormGroup;
  isLoading: boolean;

  constructor(
    private fb: FormBuilder,
    private teamApiService: TeamApiService,
    private teamStoreService: TeamStoreService,
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    // Init form
    this.formControl = this.fb.group({
      name: [
        this.team.name,
        [Validators.required, Validators.minLength(3), Validators.maxLength(40)]
      ]
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onSubmit(): void {
    if (this.formControl.valid) {
      this.isLoading = true;
      this.teamApiService
        .updateTeam(this.team._id_team, {
          name: this.formControl.controls.name.value
        })
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((resp) => {
          this.isLoading = false;
          this.teamStoreService.updateTeam({
            name: this.formControl.controls.name.value
          });
          this.alertService.showAlert('teamUpdated');
        });
    }
  }

  onDelete(): void {
    const conf = confirm('Are you sure you want to delete the team?');
    if (conf === true) {
      this.teamApiService
        .deleteTeam(this.team._id_team)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((resp) => {
          // this.router.navigate(['/app']);
        });

      this.alertService.showAlert('teamRemoved');
    }
  }
}
