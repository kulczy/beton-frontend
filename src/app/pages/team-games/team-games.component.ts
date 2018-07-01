import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  AfterViewChecked
} from '@angular/core';
import { TeamStoreService } from '../../services/team.store.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Team, Type, Member } from '../../models';
import { TeamApiService } from '../../services/team.api.service';

@Component({
  selector: 'app-team-games',
  templateUrl: './team-games.component.html'
})
export class TeamGamesComponent
  implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
  private unsubscribe = new Subject<void>();
  team: Team;
  currentMember: Member;
  fixedHeaderLastMembersLength: number; // For fixed headers
  showMoreButton = true;
  showMoreButtonLoading = false;

  constructor(
    private teamStoreService: TeamStoreService,
    private teamApiService: TeamApiService
  ) {}

  ngOnInit(): void {
    // Get team data from store
    this.teamStoreService
      .getTeam()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((resp) => {
        // Filter to display only members who accept invite (is_member = 1)
        const newTeam = Object.assign({}, resp.team);
        const newMembers = resp.team.members.filter((m) => m.is_member === 1);
        newTeam.members = newMembers;

        this.team = newTeam;
        this.currentMember = resp.currentMember;
      });
  }

  // Load more games
  onLoadMoreGames(): void {
    this.showMoreButtonLoading = true;
    this.teamApiService
      .getGames(this.team.url, this.teamStoreService.gamesIdList())
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((resp) => {
        if (resp.games.length < 10) {
          this.showMoreButton = false;
        }
        this.teamStoreService.addGamesAndTypes(resp);
        this.showMoreButtonLoading = false;
      });
  }

  // For fixed headers
  ngAfterViewInit(): void {
    this.setFixedHeaders();
    this.fixedHeaderLastMembersLength = this.team.members.length;
  }
  // For fixed headers
  ngAfterViewChecked(): void {
    if (this.fixedHeaderLastMembersLength < this.team.members.length) {
      this.setFixedHeaders();
      this.fixedHeaderLastMembersLength = this.team.members.length;
    }
  }

  // For fixed headers
  setFixedHeaders(): void {
    // Get all fixed names
    const fixedNames = document.querySelectorAll('.is-fixed');
    // Get first name element
    const name = document.querySelector('.is-fixed-wrapper');
    // Get initial Y of names
    const rect: any = name.getBoundingClientRect();
    const y = rect.y * -1 - 16;
    // Set position on init
    for (let i = 0; i < fixedNames.length; ++i) {
      fixedNames[i].setAttribute('style', `top: ${y}px`);
    }

    // Scroll
    window.onscroll = () => {
      const newRect: any = name.getBoundingClientRect();
      const newY = newRect.y * -1 - 16;

      for (let i = 0; i < fixedNames.length; ++i) {
        fixedNames[i].setAttribute('style', `top: ${newY}px`);

        if (newY < 20) {
          fixedNames[i].classList.add('hide');
        } else {
          fixedNames[i].classList.remove('hide');
        }
      }
    };
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
