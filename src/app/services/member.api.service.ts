import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_PATH } from '../params';
import { Team, Member } from '../models/index';
import { Observable, pipe, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MemberApiService {
  constructor(private http: HttpClient) {}

  /**
   * Insert new member
   * @param teamURL
   * @param userEmail
   */
  addMember(teamID: number, userEmail: string): Observable<any> {
    return this.http
      .post(`${API_PATH}member`, { id_team: teamID, email: userEmail })
      .pipe(catchError((err, caught) => of(false)));
  }

  /**
   * Remove member from the team
   * @param memberID member ID
   * @param teamID team ID to verify
   * if sender is part of the team
   */
  deleteMember(memberID: number, teamID: any): Observable<any> {
    const params = new HttpParams().set('id_team', teamID);

    return this.http
      .delete(`${API_PATH}member/${memberID}`, { params })
      .pipe(catchError((err, caught) => of(false)));
  }

  /**
   * Update membership data
   * @param memberID member ID
   * @param data member data
   */
  updateMember(memberID: number, data: Member): Observable<any> {
    return this.http
      .patch(`${API_PATH}member/${memberID}`, data)
      .pipe(catchError((err, caught) => of(false)));
  }
}
