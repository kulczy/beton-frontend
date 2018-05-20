import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Team } from '../../models';
import { TeamApiService } from '../../services/team.api.service';
import { TeamsStoreService } from '../../services/teams.store.service';
import { MemberApiService } from '../../services/member.api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-teams-add',
  templateUrl: './teams-add.component.html'
})
export class TeamsAddComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  formControl: FormGroup;
  isLoading: boolean;
  canCreate: string;

  constructor(
    private fb: FormBuilder,
    private teamApiService: TeamApiService,
    private teamsStoreService: TeamsStoreService,
    private memberApiService: MemberApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Create form
    this.formControl = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });

    // Check if user can create new team
    this.memberApiService
      .countCreatedTeams(this.authService.getUserID())
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((resp) => {
        this.canCreate = resp.resp ? 'yes' : 'no';
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  /**
   * Call team service to add new team
   */
  onSubmit(): void {
    if (this.formControl.valid) {
      // Create new team object
      const newTeam: Team = { name: this.formControl.controls.name.value };

      // Start loader
      this.isLoading = true;

      // Save team
      this.teamApiService
        .addTeam(newTeam)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((resp) => {
          const createdTeam = { team: resp.newTeam, ...resp.newMember }; // Create new member
          this.teamsStoreService.addTeams([createdTeam]); // Add new member to store
          this.isLoading = false; // Stop loader
          this.router.navigate(['/app']); // Redirect
        });
    }
  }
}
