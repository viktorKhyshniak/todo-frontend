import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Constance } from '../constants';
import { catchError, mapTo, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly JWT_TOKEN = 'token';
  private readonly REFRESH_TOKEN = 'refreshToken';
  private readonly CURRENT_USER = 'currentUser';
  public loggedUser: {};
  currentUserSubject$ = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    this.currentUserSubject$.next(JSON.parse(localStorage.getItem('currentUser')) ?
      JSON.parse(localStorage.getItem('currentUser')) : null);
  }

  login(user: { login: string, password: string }): Observable<boolean> {
    return this.http.post<any>(`${Constance.apiUrlConst}auth/login`, user)
      .pipe(
        tap(info => this.doLoginUser(info.user, info)),
        mapTo(true),
        catchError(error => {
          alert(error.error);
          return of(false);
        }));
  }

  logout() {
    return this.http.post<any>(`${Constance.apiUrlConst}auth/logout`, {
      'refreshToken': this.getRefreshToken()
    }).pipe(
      tap(() => this.doLogoutUser()),
      mapTo(false),
      catchError(error => {
        return of(true);
      }));
  }

  isLoggedIn() {
    return !!this.getJwtToken();
  }

  refreshToken() {
    return this.http.post<any>(`${Constance.apiUrlConst}auth/refresh`, {
      'refreshToken': this.getRefreshToken()
    }).pipe(tap((tokens) => {
      this.storeJwtToken(tokens.token);
    }));
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  private doLoginUser(user: {}, tokens) {
    this.currentUserSubject$.next(user);
    this.loggedUser = user;
    this.storeTokens(tokens);
  }

  private doLogoutUser() {
    this.loggedUser = null;
    this.currentUserSubject$.next(null);
    this.removeTokens();
  }

  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  private storeTokens(tokens) {
    localStorage.setItem(this.JWT_TOKEN, tokens.token);
    localStorage.setItem(this.REFRESH_TOKEN, tokens.refreshToken);
    localStorage.setItem(this.CURRENT_USER, JSON.stringify(tokens.user));
  }

  private removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
    localStorage.removeItem(this.CURRENT_USER);
  }

  registrationNewUser(formBody): Observable<any> {
    return this.http.post<any>(`${Constance.apiUrlConst}auth/registration`, formBody);
  }
}
