import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, of } from 'rxjs';
import {
    FormControl, FormsModule, ReactiveFormsModule, Validators,
} from '@angular/forms';
import { HeaderBarComponent } from '../shared/header-bar/header-bar.component';
import { AuthService } from '../shared/auth.service';
import { WorkoutService } from '../shared/workout.service';
import { Workout } from '../shared/interfaces/workout';
import { MovementListComponent } from './movement-list/movement-list.component';
import { WorkoutM } from '../shared/interfaces/workoutM';
import { Movement } from '../shared/interfaces/movement';
import { EditableTextComponent } from '../shared/editable-text/editable-text.component';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
    selector: 'app-workout-page',
    standalone: true,
    imports: [
        CommonModule,
        HeaderBarComponent,
        RouterLink,
        MovementListComponent,
        ReactiveFormsModule,
        FormsModule,
        EditableTextComponent,
        FooterComponent,
    ],
    templateUrl: './workout-page.component.html',
    styles: '',
})
export class WorkoutPageComponent implements OnInit {
    constructor(
        public authService: AuthService,
        private router: Router,
        public workoutService: WorkoutService,
        private route: ActivatedRoute,
    ) {}

    get id() {
        return Number(this.route.snapshot.paramMap.get('id'));
    }

    initName = '';
    date?: string;
    initNotes = '';
    movementList: Movement[] = [];
    showNotes = false;

    errorMessage = '';

    setMovementList(emittedList: Movement[]) {
        this.movementList = emittedList;
    }

    toggleNotes() {
        this.showNotes = !this.showNotes;
    }

    ngOnInit(): void {
        // navigate to login if unauthorized
        if (!this.authService.getIsAuth()) {
            this.authService.authCheck().subscribe(
                (authRes) => {
                    if (!authRes.isAuth) {
                        this.router.navigate(['/login']);
                    } else {
                        this.fetchWorkoutByID();
                    }
                },
            );
        } else {
            this.fetchWorkoutByID();
        }
    }

    fetchWorkoutByID(): void {
        // fetch on init
        this.workoutService.fetchWorkoutByID(Number(this.id)).subscribe(
            (workoutM) => {
                this.date = this.convertISO(workoutM.data.date);
                this.initNotes = workoutM.data.notes;
                this.movementList = workoutM.data.movementList;
                this.initName = workoutM.data.name;
                this.errorMessage = workoutM.message;
            },
        );
    }

    private convertISO(iso: string): string {
        if (iso === undefined || iso === null) {
            return '';
        }

        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        const mm = iso.substring(5, 7);
        let dd = iso.substring(8, 10);

        if (dd[0] === '0') {
            dd = dd.substring(1);
        }

        return `${months[Number(mm) - 1]} ${dd}`;
    }
}
