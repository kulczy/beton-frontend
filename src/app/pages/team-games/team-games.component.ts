import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { TeamStoreService } from '../../services/team.store.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Team, Type, Member } from '../../models';

@Component({
  selector: 'app-team-games',
  templateUrl: './team-games.component.html'
})
export class TeamGamesComponent implements OnInit, OnDestroy, AfterViewInit {
  private unsubscribe = new Subject<void>();
  team: Team;
  currentMember: Member;

  constructor(private teamStoreService: TeamStoreService) {}

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

  // Fixed names
  ngAfterViewInit(): void {
    // Get all fixed names
    const fixedNames = document.querySelectorAll('.is-fixed');
    // Get first name element
    const name = document.querySelector('.is-fixed-wrapper');
    // Get initial Y of names
    const rect: any = name.getBoundingClientRect();
    const y = (rect.y * -1) - 16;
    // Set position on init
    for (let i = 0; i < fixedNames.length; ++i) {
      fixedNames[i].setAttribute('style', `top: ${y}px`);
    }

    // Scroll
    window.onscroll = () => {
      const newRect: any = name.getBoundingClientRect();
      const newY = (newRect.y * -1) - 16;

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
