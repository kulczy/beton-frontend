import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Game } from '../models';
import { catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { API_PATH } from '../params';

@Injectable()
export class GameApiService {
  constructor(private http: HttpClient) {}

  /**
   * Insert new game
   * @param gameData
   */
  addGame(gameData: Game): Observable<any> {
    return this.http
      .post(`${API_PATH}game`, gameData)
      .pipe(catchError((err, caught) => of(false)));
  }

  /**
   * Update game
   * @param gameData
   */
  updateGame(gameID: number, gameData: Game): Observable<any> {
    return this.http
      .patch(`${API_PATH}game/${gameID}`, gameData)
      .pipe(catchError((err, caught) => of(false)));
  }
}
