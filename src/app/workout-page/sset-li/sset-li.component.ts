import { CommonModule } from '@angular/common';
import {
    Component, EventEmitter, Input, Output,
} from '@angular/core';
import { Sset } from '../../shared/interfaces/sset';
import { EditableNumComponent } from '../../shared/editable-num/editable-num.component';
import { MovementService } from '../../shared/movement.service';
import { SsetService } from '../../shared/sset.service';

@Component({
    selector: 'app-sset-li',
    standalone: true,
    imports: [
        CommonModule,
        EditableNumComponent,
    ],
    templateUrl: './sset-li.component.html',
    styles: '',
})
export class SsetLiComponent {
    constructor(
        public ssetService: SsetService,
    ) {}

    @Input() sset!: Sset;
    @Output() deleteSsetIdEvent = new EventEmitter();

    emitDeleteSsetIdEvent() {
        this.deleteSsetIdEvent.emit(this.sset.id);
    }
}
