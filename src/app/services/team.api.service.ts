import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
   * Get all user membership with team data
   */
  getTeams(): Observable<any> {
    return this.http
      .get(`${API_PATH}membershipfull/${this.authService.getUserID()}`)
      .pipe(catchError((err, caught) => empty()));
  }
}
