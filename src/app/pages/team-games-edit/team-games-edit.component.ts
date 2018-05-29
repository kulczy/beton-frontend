import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { TeamStoreService } from '../../services/team.store.service';
import { GameApiService } from '../../services/game.api.service';
import { Game } from '../../models';

@Component({
  selector: 'app-team-games-edit',
  templateUrl: './team-games-edit.component.html'
})
export class TeamGamesEditComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  formControl: FormGroup;
  isLoading: boolean;
  isEdit = false;
  teamID: number;
  gameID: number;
  teamURL: string;
  // Date and time settings
  isMeridian = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private teamStoreService: TeamStoreService,
    private gameApiService: GameApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Create form
    this.formControl = this.fb.group({
      close_at_date: [new Date(), [Validators.required]],
      close_at_time: [new Date(), [Validators.required]],
      player_a: ['', [Validators.required]],
      player_b: ['', [Validators.required]],
      score_a: [''],
      score_b: ['']
    });

    // Set team data
    this.teamID = this.teamStoreService.getTeam().getValue()._id_team;
    this.teamURL = this.teamStoreService.getTeam().getValue().url;

    // Get game ID from url
    this.activatedRoute.params
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((params: Params) => {
        if (params.game_id) {
          // Game ID to number
          const gameID = Number(params.game_id);

          // Get game data from store
          const gameData = this.teamStoreService.findGame(gameID);

          // Get current user data
          const currentMember = this.teamStoreService
            .currentTeamMember()
            .getValue();

          // Settings if game exist in the store and
          // user have rights to edit game (is admin or creator)
          if (
            (gameData && currentMember.is_admin) ||
            (gameData &&
              gameData.creator_id === currentMember.user._id_user &&
              (new Date(gameData.close_at).getTime() - new Date().getTime())) > 0
          ) {
            // Set team ID
            this.gameID = gameID;

            // Set current page as edit
            this.isEdit = true;

            // Add game data to form
            this.formControl.patchValue({
              close_at_date: new Date(gameData.close_at),
              close_at_time: new Date(gameData.close_at),
              player_a: gameData.player_a,
              player_b: gameData.player_b,
              score_a: gameData.score_a,
              score_b: gameData.score_b
            });
          } else {
            this.router.navigate(['/app/team', this.teamURL]);
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  /**
   * Save game
   */
  onSubmit(): void {
    // Get full date in UTC
    const date = moment(this.formControl.controls.close_at_date.value).format(
      'DD/MM/YYYY'
    );
    const time = moment(this.formControl.controls.close_at_time.value).format(
      'HH.mm'
    );
    const dateTime = moment(`${date} ${time}`, 'DD/MM/YYYY HH:mm')
      .utc()
      .format();

    // Create fresh game object
    const newGame: Game = {
      close_at: dateTime,
      id_team: this.teamID,
      player_a: this.formControl.controls.player_a.value,
      player_b: this.formControl.controls.player_b.value,
      score_a: this.formControl.controls.score_a.value || null,
      score_b: this.formControl.controls.score_b.value || null
    };

    // Insert new game
    if (this.formControl.valid && !this.isEdit) {
      this.gameApiService
        .addGame(newGame)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((resp) => {
          this.router.navigate(['/app/team', this.teamURL]);
        });
    }

    // Update game
    if (this.formControl.valid && this.isEdit) {
      this.gameApiService
        .updateGame(this.gameID, newGame)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((resp) => {
          this.router.navigate(['/app/team', this.teamURL]);
        });
    }
  }

  /**
   * Delete game
   */
  onDelete(): void {
    this.gameApiService
      .deleteGame(this.gameID, this.teamID)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((resp) => {
        this.router.navigate(['/app/team', this.teamURL]);
      });
  }
}
