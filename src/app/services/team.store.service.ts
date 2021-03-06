import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Member, Team, Game, Type } from '../models';
import { AppInfoService } from './appinfo.service';

@Injectable()
export class TeamStoreService {
  private team: BehaviorSubject<Team>;

  constructor(
    private authService: AuthService,
    private appInfoService: AppInfoService
  ) {
    this.team = new BehaviorSubject(null);
  }

  /**
   * Get all team data
   */
  getTeam(): Observable<any> {
    return this.team.pipe(
      map((team: Team) => {
        // Current logged user membership data
        const currentMember: Member = team
          ? team.members.find((m) => m.id_user === this.authService.getUserID())
          : null;

        // Number of team admins
        const adminsLength: number = team
          ? team.members.filter((m: Member) => m.is_admin === 1).length
          : null;

        return { team, currentMember, adminsLength };
      })
    );
  }

  /**
   * Get team URL value
   */
  getTeamURL(): string {
    return this.team.getValue().url;
  }

  /**
   * Get list of games id's
   */
  gamesIdList() {
    const team = Object.assign({}, this.team.getValue());
    return team.games.map((game) => game._id_game);
  }

  /**
   * Set new team
   * @param team
   */
  setTeam(team: Team): void {
    this.team.next(team);
  }

  /**
   * Clear team
   */
  clearTeam(): void {
    this.team.next(null);
  }

  /**
   * Update team data
   * @param teamData
   */
  updateTeam(teamData: Team): void {
    const newTeam = Object.assign({}, this.team.getValue(), teamData);
    this.team.next(newTeam);
  }

  /**
   * Return game by ID in team object
   * @param gameID
   */
  findGame(gameID): Game {
    const allGames = this.team.getValue().games;
    return allGames.find((x) => x._id_game === gameID);
  }

  /**
   * Add new game
   * @param game
   */
  addGame(game: Game): void {
    const team = Object.assign({}, this.team.getValue());
    team.games.unshift(game);
    team.games = this.sortGames(team.games);
    this.team.next(team);
  }

  /**
   * Update game
   * @param game
   */
  updateGame(game: Game): void {
    const team = Object.assign({}, this.team.getValue());
    const i = team.games.findIndex((g) => g._id_game === game._id_game);
    if (i !== -1) {
      team.games[i] = Object.assign({}, team.games[i], game);
      team.games = this.sortGames(team.games);
      this.team.next(team);
    }
  }

  /**
   * Remove game
   * @param gameID
   */
  removeGame(gameID: number): void {
    const team = Object.assign({}, this.team.getValue());
    const i = team.games.findIndex((g) => g._id_game === gameID);
    if (i !== -1) {
      team.games.splice(i, 1);
      this.team.next(team);
    }
  }

  /**
   * Fill team by new games and types
   * @param newTeamData
   */
  addGamesAndTypes(newTeamData) {
    const team = Object.assign({}, this.team.getValue());

    // Add types
    for (const key of Object.keys(team.types)) {
      if (key in newTeamData.types) {
        team.types[key] = Object.assign(
          {},
          team.types[key],
          newTeamData.types[key]
        );
      }
    }

    team.games = team.games.concat(newTeamData.games); // Add new games

    team.games.sort((a, b) => a._id_game - b._id_game); // Sort games by ID
    // Filter for duplicates
    const newGames = team.games.filter(
      (item, i) =>
        team.games.length - 1 === i ||
        item._id_game !== team.games[i + 1]._id_game
    );
    team.games = newGames;

    team.games = this.sortGames(team.games); // Sort all games
    this.team.next(team); // Set team
  }

  /**
   * Set new type data
   * @param type
   */
  setType(type: Type): void {
    const team = Object.assign({}, this.team.getValue());
    if (!(type.id_user in team.types)) {
      team.types[type.id_user] = {};
    }
    team.types[type.id_user][type.id_game] = type;
    this.team.next(team);
  }

  /**
   * Add new member to team
   * @param member
   */
  addNewMember(member: Member): void {
    const team = Object.assign({}, this.team.getValue());
    team.members.push(member);
    team.types[member.id_user] = {};
    this.team.next(team);
  }

  /**
   * Remove member from team object
   * @param userID
   */
  removeMember(userID): void {
    const team = Object.assign({}, this.team.getValue());
    const newMembers = team.members.filter((m) => m.id_user !== Number(userID));
    team.members = newMembers;
    delete team.types[userID];
    this.team.next(team);
  }

  /**
   * Update member data
   * @param member
   */
  updateMemer(member: Member): void {
    const team = Object.assign({}, this.team.getValue());
    const i = team.members.findIndex((m) => m._id_member === member._id_member);
    if (i !== -1) {
      team.members[i] = Object.assign({}, team.members[i], member);
      this.team.next(team);
    }
  }

  /**
   * Trigger game sorting
   */
  goSortGames(): void {
    const team = Object.assign({}, this.team.getValue());
    team.games = this.sortGames(team.games);
    this.team.next(team);
  }

  /**
   * Sort games
   * @param games
   */
  private sortGames(games: Game[]) {
    const newGames = [];
    const gamesOpen = [];
    const gamesClosed = [];

    // Split games to open and slode
    games.forEach((g) => {
      if (
        new Date(g.close_at).getTime() > this.appInfoService.appDate().getTime()
      ) {
        gamesOpen.push(g);
      } else {
        gamesClosed.push(g);
      }
    });

    // Sort open games
    gamesOpen.sort(
      (a, b) => new Date(a.close_at).getTime() - new Date(b.close_at).getTime()
    );

    // Sort closed games
    gamesClosed.sort(
      (a, b) => new Date(b.close_at).getTime() - new Date(a.close_at).getTime()
    );

    return newGames.concat(gamesOpen, gamesClosed);
  }
}
