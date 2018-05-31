import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Team } from '../../models';
import { TeamStoreService } from '../../services/team.store.service';

@Component({
  selector: 'app-team-edit',
  templateUrl: './team-edit.component.html'
})
export class TeamEditComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  team: Team;
  allowAdminDelete: boolean;

  constructor(private teamStoreService: TeamStoreService) {}

  ngOnInit(): void {
    // Get team members data
    this.teamStoreService
      .getTeam()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((resp) => {
        this.team = resp.team;
        this.allowAdminDelete = resp.adminsLength > 1 ? true : false;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
