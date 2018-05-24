import { Component, OnInit, OnDestroy } from '@angular/core';
import { TeamStoreService } from '../../services/team.store.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Team, Type } from '../../models';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-team-games',
  templateUrl: './team-games.component.html'
})
export class TeamGamesComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  team: Team;
  currentUserID: number;

  constructor(
    private teamStoreService: TeamStoreService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get team data from store
    this.teamStoreService
      .getTeam()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((resp: Team) => {
        if (resp.hasOwnProperty('name')) {
          this.team = resp;
        }
      });

    // Get current user ID
    this.currentUserID = this.authService.getUserID();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  /**
   * Display looped user type
   * @param userID
   * @param gameID
   */
  displayType(userID: number, gameID: number): string {
    // Default type
    let type = 'x';

    // If user type loop current game
    if (this.team.types[userID] && this.team.types[userID][gameID]) {
      const { type_a, type_b } = this.team.types[userID][gameID];
      type = `${type_a} : ${type_b}`;
    }

    return type;
  }

  /**
   * Return user type object to pass to type component
   * @param userID
   * @param gameID
   */
  getType(userID: number, gameID: number): Type {
    if (this.team.types[userID] && this.team.types[userID][gameID]) {
      return this.team.types[userID][gameID];
    }
    return null;
  }
}
