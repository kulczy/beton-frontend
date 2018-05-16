import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_PATH } from '../params';
// import { Team, Member } from '../models/index';
import { Observable, pipe, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
// import { AuthService } from './auth.service';

@Injectable()
export class AccessService {
  constructor(private http: HttpClient) {}

  getStatus(id_user, queryTeamBy, gueryTeamValue, question): Observable<any> {
    const params = new HttpParams()
      .set('id_user', id_user)
      .set('queryTeamBy', queryTeamBy)
      .set('gueryTeamValue', gueryTeamValue)
      .set('question', question);

    return this.http
      .get(`${API_PATH}utils/member_status`, { params })
      .pipe(catchError((err, caught) => of(false)));
  }
}
