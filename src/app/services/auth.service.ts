import { Injectable } from '@angular/core';
import { LOCALSTORAGE_TOKEN_KEY, FB_OPTIONS, FB_PARAMS } from '../params';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, from, pipe } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { FacebookService, LoginResponse } from 'ngx-facebook';
import { API_SERVER, API_PATH } from '../params';
const jwt = new JwtHelperService();

@Injectable()
export class AuthService {
  private token: string;

  constructor(private fb: FacebookService, private http: HttpClient) {
    // Init facebook SDK
    fb.init(FB_PARAMS);
    // Get JWT token from local storage if exist
    this.token = localStorage.getItem(LOCALSTORAGE_TOKEN_KEY) || null;
  }

  /**
   * Check if JWT token is expired
   * return boolean
   */
  isLoggedIn(): boolean {
    return this.token && !jwt.isTokenExpired(this.token);
  }

  /**
   * Call facebook login api
   * Return observable to use in pipe in login process
   */
  private callFacebookApi(): Observable<LoginResponse> {
    // Return login responce from facebook and change from promise to observable
    return from(this.fb.login(FB_OPTIONS));
  }

  /**
   * Call beton api to
   * Send facebook token, and get JWT token
   * Return observable to use in pipe in login process
   * @param fbToken facebook token
   */
  private callApi(fbToken): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + fbToken
    });
    return this.http.get(API_SERVER + API_PATH + 'utils/auth', { headers });
  }

  /**
   * Login process
   * First call facebook api to get facebook token,
   * then call beton api to get JWT token
   */
  login(): Observable<any> {
    return this.callFacebookApi().pipe(
      catchError((err, caught) => {
        return [false]; // Return false if user cancel FB login
      }),
      switchMap((FB_response: LoginResponse) => {
        return FB_response
          ? this.callApi(FB_response.authResponse.accessToken)
          : [false];
      }),
      map((API_response) => {
        if (!API_response) {
          return false;
        }
        this.token = API_response.token;
        localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, API_response.token);
        return true;
      })
    );
  }

  /**
   * Logout
   */
  logout(): void {
    this.token = null;
    localStorage.removeItem(LOCALSTORAGE_TOKEN_KEY);
  }
}
