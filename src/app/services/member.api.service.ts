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
   * @param id_team ID of the team
   * @param email invited user email
   * @param inviting_id inviting user ID
   */
  addMember(id_team: number, email: string, inviting_id: number): Observable<any> {
    return this.http
      .post(`${API_PATH}member`, { id_team, email, inviting_id })
      .pipe(catchError((err, caught) => of(false)));
  }

  /**
   * Remove member from the team
   * @param userID
   * @param teamID
   * if sender is part of the team
   */
  deleteMember(userID: any, teamID: any): Observable<any> {
    const params = new HttpParams()
      .set('id_user', userID)
      .set('id_team', teamID);

    return this.http
      .delete(`${API_PATH}member`, { params })
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

  /**
   * Count teams that user did create
   * @param userID
   */
  countCreatedTeams(userID: number): Observable<any> {
    return this.http
      .get(`${API_PATH}membershipcreatorcount/${userID}`)
      .pipe(catchError((err, caught) => of(false)));
  }
}
