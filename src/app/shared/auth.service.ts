import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    Observable, of, catchError, tap, map,
} from 'rxjs';
import { AuthRes } from './interfaces/auth-res';
import { MessageRes } from './interfaces/message-res';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private url = 'http://localhost:3000/api';
    private httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        withCredentials: true,
    };

    private isAuth = false;
    private username = '';

    constructor(private http: HttpClient) { }

    authCheck(): Observable<AuthRes> {
        return this.http.get<AuthRes>(`${this.url}/authCheck`, this.httpOptions)
            .pipe(
                tap((authRes) => { this.isAuth = authRes.isAuth; this.username = authRes.username; }),
                catchError(() => of({ isAuth: false, username: '' } as AuthRes)),
            );
    }

    login(username: string, password: string): Observable<string> {
        const req = { username, password };
        return this.http.post<MessageRes>(`${this.url}/login`, req, this.httpOptions)
            .pipe(
                map((messageRes: MessageRes) => 'success'),
                tap(() => { this.isAuth = true; this.username = username; }),
                catchError((err) => {
                    console.log(err);
                    console.log(err.status);
                    if (err.status === 401 || err.status === 400) {
                        return of('Incorrect login');
                    }
                    if (err.status === 0) {
                        return of('My servers are off, please try again later');
                    }
                    return of('Something went wrong, please try again');
                }),
            );
    }

    signup(username: string, password: string): Observable<string> {
        const req = { username, password };
        return this.http.post<MessageRes>(`${this.url}/users`, req, this.httpOptions)
            .pipe(
                map((messageRes: MessageRes) => 'success'),
                tap(() => { this.isAuth = true; this.username = username; }),
                catchError((err) => {
                    if (err.status === 409 || err.status === 400) {
                        return of('Username is taken');
                    }
                    if (err.status === 0) {
                        return of('My servers are off, please try again later');
                    }
                    return of('Something went wrong, please try again');
                }),
            );
    }

    logout(): Observable<string> {
        const req = {};
        return this.http.post<MessageRes>(`${this.url}/logout`, req, this.httpOptions)
            .pipe(
                map((messageRes: MessageRes) => 'success'),
                tap(() => { this.isAuth = false; this.username = ''; }),
                catchError((err) => of('Something went wrong, please try again')),
            );
    }

    getIsAuth(): boolean {
        return this.isAuth;
    }

    getUsername(): string {
        return this.username;
    }

    setIsAuth(isAuth: boolean): void {
        this.isAuth = isAuth;
    }

    setUsername(username: string): void {
        this.username = username;
    }
}
