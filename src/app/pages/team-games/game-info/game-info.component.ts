import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Game, Member } from '../../../models';
import { TimerService } from '../../../services/timer.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TeamStoreService } from '../../../services/team.store.service';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  providers: [TimerService]
})
export class GameInfoComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  game: Game;
  @Input() currentMember: Member;
  @Input()
  set gameData(game: Game) {
    this.timerService.setGameTime(game.close_at);
    this.game = game;
  }

  constructor(
    private timerService: TimerService,
    private teamStoreService: TeamStoreService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Subscribe to observable
    // triggered when counting games close
    this.timerService
      .getCloseNow()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((resp) => {
        this.teamStoreService.goSortGames();
      });
  }

  ngOnDestroy(): void {
    this.timerService.clearInterval();
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  displayDate(date: any): string {
    return `${moment(date).format('DD.MM.YYYY, HH:mm')}`;
  }

  onEdit() {
    if (
      (this.currentMember.user._id_user === this.game.creator_id &&
        !this.timerService.isClosed) ||
      this.currentMember.is_admin
    ) {
      this.router.navigate(['../game', this.game._id_game], {
        relativeTo: this.activatedRoute
      });
    }
  }
}
