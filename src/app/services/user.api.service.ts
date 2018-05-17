import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_PATH } from '../params';
// import { Team, Member } from '../models/index';
import { Observable, pipe, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
// import { AuthService } from './auth.service';

@Injectable()
export class UserApiService {
  constructor(private http: HttpClient) {}

  getUserByEmail(email): Observable<any> {
    return this.http
      .get(`${API_PATH}user/${email}`)
      .pipe(catchError((err, caught) => of(false)));
  }
}
