import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
    Observable, pipe, catchError, of, tap, map,
} from 'rxjs';
import { AuthService } from './auth.service';
import { Workout } from './interfaces/workout';
import { WorkoutM } from './interfaces/workoutM';

@Injectable({
    providedIn: 'root',
})
export class WorkoutService {
    private url = 'http://localhost:3000/api';
    private httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        withCredentials: true,
    };

    constructor(
        private http: HttpClient,
        private authService: AuthService,
    ) { }

    createWorkout(oldWorkoutList: Workout[]): Observable<Workout[]> {
        const req = { name: 'new workout', date: new Date(new Date().toLocaleDateString()).toISOString().substring(0, 10) };
        return this.http.post<Workout>(`${this.url}/workouts`, req, this.httpOptions)
            .pipe(
                map(
                    (newWorkout) => {
                        oldWorkoutList.unshift(newWorkout);
                        return oldWorkoutList;
                    },
                ),
                catchError((err) => {
                    if (err.status === 401) {
                        this.authService.setIsAuth(false);
                        this.authService.setUsername('');
                    }
                    return of(oldWorkoutList);
                }),
            );
    }

    fetchWorkouts(): Observable<{workoutList: Workout[], errorMessage: string}> {
        return this.http.get<Workout[]>(`${this.url}/users/${this.authService.getUsername()}/workouts`, this.httpOptions)
            .pipe(
                map(
                    (workoutList) => ({ workoutList, errorMessage: '' }),
                ),
                catchError((err) => {
                    if (err.status === 401) {
                        this.authService.setIsAuth(false);
                        this.authService.setUsername('');
                    }
                    return of({ workoutList: [], errorMessage: 'An error occured when getting your workouts, please try again' });
                }),
            );
    }

    fetchWorkoutByID(id: number): Observable<WorkoutM> {
        return this.http.get<Workout>(`${this.url}/workouts/${id}`, this.httpOptions)
            .pipe(
                map(
                    (workout) => ({ data: workout, message: '' }),
                ),
                catchError((err) => {
                    let message = 'An error occured when getting your workout, please try again';

                    if (err.status === 401) {
                        this.authService.setIsAuth(false);
                        this.authService.setUsername('');
                    } else if (err.status === 403) {
                        message = 'You do not own this workout';
                    } else if (err.status === 404 || err.status === 400) {
                        message = 'This workout does not exist';
                    }

                    return of({ data: {} as Workout, message });
                }),
            );
    }

    patchWorkoutByID(value: string, id: number, fieldName: string): Observable<string> {
        const req = { [fieldName]: (fieldName === 'name' && value === '') ? 'workout' : value };
        return this.http.patch<Workout>(`${this.url}/workouts/${id}`, req, this.httpOptions)
            .pipe(
                map(
                    (workout) => workout[fieldName as keyof Workout] as string,
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

    deleteWorkoutByID(id: number, oldWorkoutList: Workout[]): Observable<Workout[]> {
        return this.http.delete<string>(`${this.url}/workouts/${id}`, this.httpOptions)
            .pipe(
                map(
                    () => oldWorkoutList.filter((workout) => workout.id !== id),
                ),
                catchError(
                    (err) => {
                        if (err.status === 401) {
                            this.authService.setIsAuth(false);
                            this.authService.setUsername('');
                        }
                        return of(oldWorkoutList);
                    },
                ),
            );
    }
}
