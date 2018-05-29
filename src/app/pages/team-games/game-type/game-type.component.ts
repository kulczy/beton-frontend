import { Component, OnDestroy, Input } from '@angular/core';
import { Game, Member, Type } from '../../../models';
import { TimerService } from '../../../services/timer.service';

@Component({
  selector: 'app-game-type',
  templateUrl: './game-type.component.html',
  providers: [TimerService]
})
export class GameTypeComponent implements OnDestroy {
  game: Game;
  @Input() teamID: number;
  @Input() members: Member[];
  @Input() currentMember: Member;
  @Input() types: Type[];
  @Input()
  set gameData(game: Game) {
    this.timerService.setGameTime(game.close_at);
    this.game = game;
  }

  constructor(private timerService: TimerService) {}

  ngOnDestroy(): void {
    this.timerService.clearInterval();
  }

  /**
   * Display looped user type
   * @param userID
   */
  displayType(userID: number): string {
    // Default type
    let type = null;

    // Get user type if exist
    if (this.types[userID] && this.types[userID][this.game._id_game]) {
      const { type_a, type_b } = this.types[userID][this.game._id_game];
      type = `${type_a} : ${type_b}`;
    }

    // Display '?' instead type if game is on
    if (!this.timerService.isClosed && type) {
      type = '?';
    }

    // Display '-' if user does not type yet
    if (!type) {
      type = '-';
    }

    return type;
  }

  /**
   * Return user type object to pass to type component
   * @param userID
   */
  getType(userID: number): Type {
    if (this.types[userID] && this.types[userID][this.game._id_game]) {
      return this.types[userID][this.game._id_game];
    }
    return null;
  }

  /**
   * Check if user win the game
   * Use for highlight type in table
   * @param userID
   */
  isWinner(userID: number): boolean {
    const type = this.getType(userID);
    return type &&
      type.type_a === this.game.score_a &&
      type.type_b === this.game.score_b &&
      this.timerService.isClosed
      ? true
      : false;
  }
}
