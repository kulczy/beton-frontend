import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Team } from '../../models';
import { TeamStoreService } from '../../services/team.store.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-team-edit',
  templateUrl: './team-edit.component.html'
})
export class TeamEditComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  team: Team;
  allowAdminDelete: boolean;

  constructor(
    private teamStoreService: TeamStoreService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get team members data
    this.teamStoreService
      .getTeam()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((team: Team) => {
        if (team.hasOwnProperty('name')) {
          this.team = team;
        }
      });

    // Get admins delete permission
    this.teamStoreService
      .allowAdminDelete()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((allow: boolean) => {
        this.allowAdminDelete = allow;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
