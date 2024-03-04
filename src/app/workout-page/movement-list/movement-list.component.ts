import { CommonModule, NgFor } from '@angular/common';
import {
    Component, EventEmitter, Input, Output,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Movement } from '../../shared/interfaces/movement';
import { MovementLiComponent } from '../movement-li/movement-li.component';
import { MovementService } from '../../shared/movement.service';
import { AuthService } from '../../shared/auth.service';

@Component({
    selector: 'app-movement-list',
    standalone: true,
    imports: [
        CommonModule,
        MovementLiComponent,
        NgFor,
    ],
    templateUrl: './movement-list.component.html',
    styles: '',
})
export class MovementListComponent {
    constructor(
        public authService: AuthService,
        private router: Router,
        private movementService: MovementService,
        private route: ActivatedRoute,
    ) {}

    @Input() workout_id!: number;
    @Input() movementList!: Movement[];
    @Output() updateMovementListEvent = new EventEmitter<Movement[]>();
    @Input() notesActive!: boolean;
    @Output() toggleNotesEvent = new EventEmitter();

    emitUpdateMovementListEvent(newList: Movement[]) {
        this.updateMovementListEvent.emit(newList);
    }

    emitToggleNotesEvent() {
        this.toggleNotesEvent.emit();
    }

    createMovement() {
        this.movementService.createMovement(this.workout_id, [...this.movementList]).subscribe(
            (upMovementList) => { this.emitUpdateMovementListEvent(upMovementList); },
        );

        const temp: Movement = {
            id: -1,
            movType: 'new exercise',
            restAfter: -1,
            notes: '',
            ssetList: [],
        };
        this.movementList.push(temp);
    }

    deleteMovement(id: number) {
        this.movementService.deleteMovementByID(id, [...this.movementList]).subscribe(
            (upMovementList) => { this.emitUpdateMovementListEvent(upMovementList); },
        );

        this.movementList = this.movementList.filter((movement) => movement.id !== id);
    }
}
