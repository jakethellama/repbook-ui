import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { HeaderBarComponent } from '../shared/header-bar/header-bar.component';
import { AuthService } from '../shared/auth.service';
import { WorkoutService } from '../shared/workout.service';
import { Workout } from '../shared/interfaces/workout';
import { WorkoutListComponent } from './workout-list/workout-list.component';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        HeaderBarComponent,
        CommonModule,
        WorkoutListComponent,
        FooterComponent,
    ],
    templateUrl: './home.component.html',
    styles: '',
})
export class HomeComponent implements OnInit {
    constructor(
        public authService: AuthService,
        private router: Router,
        private workoutService: WorkoutService,
    ) {}

    workoutList: Workout[] = [];
    errorMessage = '';

    ngOnInit(): void {
        // navigate to login if unauthorized
        if (!this.authService.getIsAuth()) {
            this.authService.authCheck().subscribe(
                (authRes) => {
                    if (!authRes.isAuth) {
                        this.router.navigate(['/login']);
                    } else {
                        this.fetchWorkouts();
                    }
                },
            );
        } else {
            this.fetchWorkouts();
        }
    }

    fetchWorkouts() {
        this.workoutService.fetchWorkouts().subscribe(
            (res) => { this.workoutList = res.workoutList; this.errorMessage = res.errorMessage; },
        );
    }

    createWorkout() {
        this.workoutService.createWorkout([...this.workoutList]).subscribe(
            (workoutList) => { this.workoutList = workoutList; },
        );

        const temp: Workout = {
            id: -1,
            person: { id: -1, username: this.authService.getUsername() },
            name: 'new workout',
            date: new Date(new Date().toLocaleDateString()).toISOString().substring(0, 10),
            notes: '',
            movementList: [],
        };
        this.workoutList.unshift(temp as Workout);
    }

    deleteWorkout(id: number) {
        this.workoutService.deleteWorkoutByID(id, [...this.workoutList]).subscribe(
            (workoutList) => { this.workoutList = workoutList; },
        );

        this.workoutList = this.workoutList.filter((workout) => workout.id !== id);
    }
}
