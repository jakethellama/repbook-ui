import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
    Observable, pipe, catchError, of, tap, map,
} from 'rxjs';
import { AuthService } from './auth.service';
import { Workout } from './interfaces/workout';
import { WorkoutM } from './interfaces/workoutM';
import { Movement } from './interfaces/movement';

@Injectable({
    providedIn: 'root',
})
export class MovementService {
    private url = 'http://localhost:3000/api';
    private httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        withCredentials: true,
    };

    constructor(
        private http: HttpClient,
        private authService: AuthService,
    ) { }

    createMovement(workout_id: number, oldMovementList: Movement[]): Observable<Movement[]> {
        const req = { movType: 'new exercise', workout_id };
        return this.http.post<Movement>(`${this.url}/movements`, req, this.httpOptions)
            .pipe(
                map(
                    (newMovement) => {
                        oldMovementList.push(newMovement);
                        return oldMovementList;
                    },
                ),
                catchError(
                    (err) => {
                        if (err.status === 401) {
                            this.authService.setIsAuth(false);
                            this.authService.setUsername('');
                        }
                        return of(oldMovementList);
                    },
                ),
            );
    }

    patchMovementStringByID(value: string, id: number, fieldName: string): Observable<string> {
        const req = { [fieldName]: (fieldName === 'movType' && value === '') ? 'exercise' : value };
        return this.http.patch<Movement>(`${this.url}/movements/${id}`, req, this.httpOptions)
            .pipe(
                map(
                    (movement) => movement[fieldName as keyof Movement] as string,
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

    patchMovementNumberByID(value: number, id: number, fieldName: string): Observable<number> {
        const req = { [fieldName]: value };
        return this.http.patch<Movement>(`${this.url}/movements/${id}`, req, this.httpOptions)
            .pipe(
                map(
                    (movement) => movement[fieldName as keyof Movement] as number,
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

    deleteMovementByID(id: number, oldMovementList: Movement[]): Observable<Movement[]> {
        return this.http.delete<string>(`${this.url}/movements/${id}`, this.httpOptions)
            .pipe(
                map(
                    () => oldMovementList.filter((movement) => movement.id !== id),
                ),
                catchError(
                    (err) => {
                        if (err.status === 401) {
                            this.authService.setIsAuth(false);
                            this.authService.setUsername('');
                        }
                        return of(oldMovementList);
                    },
                ),
            );
    }
}
