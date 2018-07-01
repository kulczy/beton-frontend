import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_PATH } from '../params';
import { Team, Member } from '../models/index';
import { Observable, empty, pipe } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class TeamApiService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Insert new team
   * @param teamData new team data
   */
  addTeam(teamData: Team): Observable<any> {
    return this.http
      .post(`${API_PATH}team`, teamData)
      .pipe(catchError((err, caught) => empty()));
  }

  /**
   * Get all user membership with teams data
   * @param limit limit query teams
   * @param offset offset
   * @param is_member if set to 1, get teams where user is member
   * if set to 0, get teams where user is not member
   * if empty, get all teams
   */
  getTeams(
    limit: any = '',
    offset: any = '',
    is_member: any = ''
  ): Observable<any> {
    const params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset)
      .set('is_member', is_member);

    return this.http
      .get(`${API_PATH}membershipfull/${this.authService.getUserID()}`, {
        params
      })
      .pipe(catchError((err, caught) => empty()));
  }

  /**
   * Get full info of the team
   * with members, games, types
   * @param teamURL team url
   */
  getTeamFull(teamURL): Observable<any> {
    return this.http
      .get(`${API_PATH}full_team/${teamURL}`)
      .pipe(catchError((err, caught) => empty()));
  }

  /**
   * Get team statistics
   * @param teamURL team url
   */
  getTeamStatistics(teamURL): Observable<any> {
    return this.http
      .get(`${API_PATH}statistics/${teamURL}`)
      .pipe(catchError((err, caught) => empty()));
  }

  /**
   * Update team data
   * @param teamID
   * @param teamData
   */
  updateTeam(teamID: number, teamData: Team): Observable<any> {
    return this.http
      .patch(`${API_PATH}team/${teamID}`, teamData)
      .pipe(catchError((err, caught) => empty()));
  }

  /**
   * Delete team
   * @param teamID
   */
  deleteTeam(teamID: number): Observable<any> {
    return this.http
      .delete(`${API_PATH}team/${teamID}`)
      .pipe(catchError((err, caught) => empty()));
  }

  getGames(teamID, exclude): Observable<any> {
    const params = new HttpParams()
      .set('exclude', JSON.stringify(exclude));

    return this.http
      .get(`${API_PATH}fill_team/${teamID}`, { params })
      .pipe(catchError((err, caught) => empty()));
  }
}
