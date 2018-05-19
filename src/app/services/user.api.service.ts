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

  /**
   * Get user by email
   * @param email
   */
  getUserByEmail(email: string): Observable<any> {
    return this.http
      .get(`${API_PATH}user/${email}`)
      .pipe(catchError((err, caught) => of(false)));
  }

  /**
   * Get user by ID
   * @param userID
   */
  getUserByID(userID: number): Observable<any> {
    return this.http
      .get(`${API_PATH}user/${userID}`)
      .pipe(catchError((err, caught) => of(false)));
  }
}
