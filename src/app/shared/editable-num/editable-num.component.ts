import { CommonModule } from '@angular/common';
import {
    Component, Input, OnDestroy, OnInit, SimpleChanges,
} from '@angular/core';
import {
    FormControl, FormsModule, ReactiveFormsModule, FormGroup,
} from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { TextFieldModule } from '@angular/cdk/text-field';
import { AutoSizeInputModule } from 'ngx-autosize-input';

@Component({
    selector: 'app-editable-num',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        TextFieldModule,
        AutoSizeInputModule,
    ],
    templateUrl: './editable-num.component.html',
})
export class EditableNumComponent implements OnInit {
    @Input() servicePatchFunction!: (value: number, entityId: number, fieldName: string) => Observable<number>;
    @Input() htmlId!: string;
    @Input() entityId!: number; // id of the entity this value is a field of
    @Input() maxValue!: number;
    @Input()
    get initValue(): string { return this.initValueH; }
    set initValue(value: number) {
        if (value === -2) {
            this.initValueH = 'failure';
            this.valueControl.setValue('failure');
        } else if (value === -1) {
            this.initValueH = '';
            this.valueControl.setValue('');
        } else {
            this.initValueH = String(value);
            this.valueControl.setValue(String(value));
        }
    }
    private initValueH = '';
    @Input() fieldName!: string;
    @Input() classStyles!: string;
    @Input() isFailable!: boolean;
    @Input() isDoubleZero!: boolean;

    subValueControl?: Subscription;
    valueControl = new FormControl<string>('');

    ngOnInit(): void {
        if (this.isDoubleZero && Number(this.initValueH) < 10 && this.initValueH !== '') {
            this.initValueH = `0${this.initValueH}`;
            this.valueControl.setValue(this.initValueH);
        }
    }

    onFocusOut(): void {
        this.patchVal(this.valueControl.value ?? '');
    }

    patchVal(newValue: string): void {
        let cleanValue = 0;

        if (this.isFailable && (newValue === 'failure' || newValue === 'Failure')) {
            cleanValue = -2;
        } else if (newValue === '') {
            cleanValue = -1;
        } else {
            const noAlpha = newValue.replace(/[^\d.]/g, '');
            let normalDecimal = '';
            let hasDot = false;

            for (let i = 0; i < noAlpha.length; i += 1) {
                if (noAlpha[i] !== '.') {
                    normalDecimal += noAlpha[i];
                } else if (hasDot === false) {
                    hasDot = true;
                    normalDecimal += noAlpha[i];
                }
            }

            if (normalDecimal === '') {
                cleanValue = -1;
            } else {
                cleanValue = Number(normalDecimal);

                if (cleanValue > this.maxValue) {
                    cleanValue = this.maxValue;
                }
            }
        }

        this.servicePatchFunction(cleanValue, this.entityId, this.fieldName).subscribe(
            (updatedValue: number) => {
                if (updatedValue === -2) {
                    this.valueControl.setValue('failure');
                } else if (updatedValue === -1) {
                    this.valueControl.setValue('');
                } else if (this.isDoubleZero && updatedValue < 10) {
                    this.valueControl.setValue(`0${updatedValue}`);
                } else {
                    this.valueControl.setValue(String(updatedValue));
                }
            },
        );
    }
}
