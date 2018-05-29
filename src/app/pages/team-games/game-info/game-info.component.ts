import { Component, OnDestroy, Input } from '@angular/core';
import { Game, Member } from '../../../models';
import { TimerService } from '../../../services/timer.service';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  providers: [TimerService]
})
export class GameInfoComponent implements OnDestroy {
  game: Game;
  @Input() currentMember: Member;
  @Input()
  set gameData(game: Game) {
    this.timerService.setGameTime(game.close_at);
    this.game = game;
  }

  constructor(private timerService: TimerService) {}

  ngOnDestroy(): void {
    this.timerService.clearInterval();
  }
}
