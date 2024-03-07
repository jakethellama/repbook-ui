import { CommonModule } from '@angular/common';
import {
    Component, Input, OnDestroy, OnInit, SimpleChanges,
} from '@angular/core';
import {
    FormControl, FormsModule, ReactiveFormsModule, FormGroup,
} from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TextFieldModule } from '@angular/cdk/text-field';
import { WorkoutService } from '../workout.service';

@Component({
    selector: 'app-editable-text',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        TextFieldModule,
    ],
    templateUrl: './editable-text.component.html',
    styles: '',
})
export class EditableTextComponent implements OnInit, OnDestroy {
    constructor() {}

    @Input() servicePatchFunction!: (value: string, entityId: number, fieldName: string) => Observable<string>;
    @Input() htmlId!: string;
    @Input() entityId!: number; // id of the entity this value is a field of
    @Input() maxLength!: number;
    @Input()
    get initValue(): string { return this.initValueH; }
    set initValue(value: string) {
        this.initValueH = value;
        this.valueControl.setValue(value);
    }
    private initValueH = '';
    @Input() fieldName!: string;
    @Input() classStyles!: string;
    @Input() placeHolder!: string;

    subValueControl?: Subscription;
    valueControl = new FormControl('');

    onEnter(event: Event): void {
        event.preventDefault();
    }

    ngOnInit(): void {
        this.subValueControl = this.valueControl.valueChanges.subscribe(
            (newValue) => {
                if (newValue!.length > this.maxLength) {
                    this.valueControl.setValue(newValue!.substring(0, this.maxLength));
                }
            },
        );
    }

    ngOnDestroy(): void {
        this.subValueControl?.unsubscribe();
    }

    onFocusOut(): void {
        this.patchVal(this.valueControl.value ?? '');
    }

    patchVal(newValue: string): void {
        this.servicePatchFunction(newValue, this.entityId, this.fieldName).subscribe(
            (updatedValue) => {
                this.valueControl.setValue(updatedValue);
            },
        );
    }
}
