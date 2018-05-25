import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Game, Type } from '../models';
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

  /**
   * Delete game
   * @param gameID
   */
  deleteGame(gameID: number, teamID: any): Observable<any> {
    const params = new HttpParams()
      .set('id_team', teamID);

    return this.http
      .delete(`${API_PATH}game/${gameID}`, { params })
      .pipe(catchError((err, caught) => of(false)));
  }

  /**
   * Insert new type
   * @param typeData
   */
  addType(typeData: Type): Observable<any> {
    return this.http
      .post(`${API_PATH}type`, typeData)
      .pipe(catchError((err, caught) => of(false)));
  }

  /**
   * Update type
   * @param typeData
   */
  updateType(typeID: number, typeData: Type): Observable<any> {
    return this.http
      .patch(`${API_PATH}type/${typeID}`, typeData)
      .pipe(catchError((err, caught) => of(false)));
  }
}
