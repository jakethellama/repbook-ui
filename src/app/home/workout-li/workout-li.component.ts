import {
    Component, EventEmitter, Input, Output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Workout } from '../../shared/interfaces/workout';

@Component({
    selector: 'app-workout-li',
    standalone: true,
    imports: [
        RouterLink,
        CommonModule,
    ],
    templateUrl: './workout-li.component.html',
    styles: '',
})
export class WorkoutLiComponent {
    @Input() workout!: Workout;
    @Output() deleteWorkoutIdEvent = new EventEmitter<number>();

    get dateString() {
        let mm = this.workout.date.substring(5, 7);
        let dd = this.workout.date.substring(8, 10);

        if (mm[0] === '0') {
            mm = mm.substring(1);
        }

        if (dd[0] === '0') {
            dd = dd.substring(1);
        }

        return `${mm}/${dd}`;
    }

    emitDeleteWorkoutIdEvent(id: number) {
        this.deleteWorkoutIdEvent.emit(id);
    }
}
