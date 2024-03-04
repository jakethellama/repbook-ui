import {
    Component, EventEmitter, Input, Output,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Workout } from '../../shared/interfaces/workout';
import { WorkoutLiComponent } from '../workout-li/workout-li.component';

@Component({
    selector: 'app-workout-list',
    standalone: true,
    imports: [
        CommonModule,
        WorkoutLiComponent,
    ],
    templateUrl: './workout-list.component.html',
    styles: '',
})
export class WorkoutListComponent {
    @Input() workoutList: Workout[] = [];
    @Output() deleteWorkoutIdEvent = new EventEmitter<number>();

    emitDeleteWorkoutIdEvent(id: number) {
        this.deleteWorkoutIdEvent.emit(id);
    }
}
