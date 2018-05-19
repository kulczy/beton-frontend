import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Team } from '../../../models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { TeamApiService } from '../../../services/team.api.service';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-team-edit-card',
  templateUrl: './team-edit-card.component.html'
})
export class TeamEditCardComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  @Input() team: Team;
  formControl: FormGroup;

  constructor(
    private fb: FormBuilder,
    private teamApiService: TeamApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Init form
    this.formControl = this.fb.group({
      name: [this.team.name, [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onSubmit(): void {
    if (this.formControl.valid) {
      this.teamApiService
        .updateTeam(this.team._id_team, {
          name: this.formControl.controls.name.value
        })
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((resp) => {
          console.log('Team updated', resp);
        });
    }
  }

  onDelete(): void {
    this.teamApiService
      .deleteTeam(this.team._id_team)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((resp) => {
        this.router.navigate(['/app']);
      });
  }
}
