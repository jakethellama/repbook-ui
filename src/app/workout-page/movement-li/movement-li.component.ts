import {
    Component, EventEmitter, Input, Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Movement } from '../../shared/interfaces/movement';
import { SsetLiComponent } from '../sset-li/sset-li.component';
import { EditableTextComponent } from '../../shared/editable-text/editable-text.component';
import { MovementService } from '../../shared/movement.service';
import { EditableNumComponent } from '../../shared/editable-num/editable-num.component';
import { SsetService } from '../../shared/sset.service';
import { Sset } from '../../shared/interfaces/sset';

@Component({
    selector: 'app-movement-li',
    standalone: true,
    imports: [
        CommonModule,
        SsetLiComponent,
        EditableTextComponent,
        EditableNumComponent,
        ReactiveFormsModule,
    ],
    templateUrl: './movement-li.component.html',
    styles: '',
})
export class MovementLiComponent {
    constructor(
        public movementService: MovementService,
        public ssetService: SsetService,
    ) {}

    @Input() movement!: Movement;
    @Output() deleteMovementIdEvent = new EventEmitter();

    emitDeleteMovementIdEvent() {
        this.deleteMovementIdEvent.emit(this.movement.id);
    }

    isOpen = false;

    toggleOpen() {
        this.isOpen = !this.isOpen;
    }

    createSset() {
        this.ssetService.createSset(this.movement.id, [...this.movement.ssetList]).subscribe(
            (upSsetList) => { this.movement.ssetList = upSsetList; },
        );

        const temp: Sset = {
            id: -1,
            reps: -1,
            weight: -1,
            mm: -1,
            ss: -1,
        };
        this.movement.ssetList.push(temp);
    }

    deleteSset(id: number) {
        this.ssetService.deleteSsetByID(id, [...this.movement.ssetList]).subscribe(
            (upSsetList) => { this.movement.ssetList = upSsetList; },
        );
        this.movement.ssetList = this.movement.ssetList.filter((sset) => sset.id !== id);
    }
}
