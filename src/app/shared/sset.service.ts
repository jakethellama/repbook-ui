import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
    Observable, pipe, catchError, of, tap, map,
} from 'rxjs';
import { AuthService } from './auth.service';
import { Workout } from './interfaces/workout';
import { WorkoutM } from './interfaces/workoutM';
import { Movement } from './interfaces/movement';
import { Sset } from './interfaces/sset';

@Injectable({
    providedIn: 'root',
})
export class SsetService {
    private url = 'http://localhost:3000/api';
    private httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        withCredentials: true,
    };

    constructor(
        private http: HttpClient,
        private authService: AuthService,
    ) { }

    createSset(movement_id: number, oldSsetList: Sset[]): Observable<Sset[]> {
        const req = { movement_id };
        return this.http.post<Sset>(`${this.url}/sets`, req, this.httpOptions)
            .pipe(
                map(
                    (newSset) => {
                        oldSsetList.push(newSset);
                        return oldSsetList;
                    },
                ),
                catchError(
                    (err) => {
                        if (err.status === 401) {
                            this.authService.setIsAuth(false);
                            this.authService.setUsername('');
                        }
                        return of(oldSsetList);
                    },
                ),
            );
    }

    patchSsetNumberByID(value: number, id: number, fieldName: string): Observable<number> {
        const req = { [fieldName]: value };
        return this.http.patch<Sset>(`${this.url}/sets/${id}`, req, this.httpOptions)
            .pipe(
                map(
                    (sset) => sset[fieldName as keyof Sset] as number,
                ),
                catchError(
                    (err) => {
                        if (err.status === 401) {
                            this.authService.setIsAuth(false);
                            this.authService.setUsername('');
                        }
                        return of(value);
                    },
                ),
            );
    }

    deleteSsetByID(id: number, oldSsetList: Sset[]): Observable<Sset[]> {
        return this.http.delete<string>(`${this.url}/sets/${id}`, this.httpOptions)
            .pipe(
                map(
                    () => oldSsetList.filter((sset) => sset.id !== id),
                ),
                catchError(
                    (err) => {
                        if (err.status === 401) {
                            this.authService.setIsAuth(false);
                            this.authService.setUsername('');
                        }
                        return of(oldSsetList);
                    },
                ),
            );
    }
}
