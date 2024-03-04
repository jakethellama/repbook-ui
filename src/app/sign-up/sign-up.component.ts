import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
    FormBuilder, Validators, FormsModule, ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/auth.service';

@Component({
    selector: 'app-sign-up',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterLink,
    ],
    templateUrl: './sign-up.component.html',
})
export class SignUpComponent implements OnInit, OnDestroy {
    constructor(
        private authService: AuthService,
        private router: Router,
        private formBuilder: FormBuilder,
    ) {}

    ngOnInit(): void {
        if (this.authService.getIsAuth()) {
            this.router.navigate(['/home']);
        } else {
            this.authService.authCheck().subscribe(
                (authRes) => {
                    if (authRes.isAuth) {
                        this.router.navigate(['/home']);
                    }
                },
            );

            this.subUserCont = this.usernameControl.statusChanges.subscribe(
                (newStatus) => {
                    if (newStatus === 'VALID') {
                        this.usernameErrorMessage = '';
                    }
                },
            );

            this.subPassCont = this.passwordControl.statusChanges.subscribe(
                (newStatus) => {
                    if (newStatus === 'VALID') {
                        this.passwordErrorMessage = '';
                    }
                },
            );

            this.subSignupForm = this.signupForm.statusChanges.subscribe(
                (newStatus) => {
                    this.submitErrorMessage = '';
                    if (newStatus === 'VALID') {
                        this.showErrorMessage = false;
                    }
                },
            );
        }
    }

    ngOnDestroy(): void {
        this.subUserCont?.unsubscribe();
        this.subPassCont?.unsubscribe();
        this.subSignupForm?.unsubscribe();
    }

    subUserCont?: Subscription;
    subPassCont?: Subscription;
    subSignupForm?: Subscription;

    signupForm = this.formBuilder.group({
        username: ['', [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(20),
            Validators.pattern('^[a-zA-Z0-9-_]+$'),
        ]],
        password: ['', [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(64),
        ]],
    });

    showErrorMessage = false;
    usernameErrorMessage = '';
    passwordErrorMessage = '';
    submitErrorMessage = '';

    get usernameControl() {
        return this.signupForm.controls.username;
    }

    get passwordControl() {
        return this.signupForm.controls.password;
    }

    onSubmit(): void {
        if (this.signupForm.invalid) {
            if (this.usernameControl.invalid) {
                this.usernameErrorMessage = 'Username is invalid. ';
            }
            if (this.passwordControl.invalid) {
                this.passwordErrorMessage = 'Password is invalid. ';
            }
            this.showErrorMessage = true;
        } else {
            this.authService.signup(this.usernameControl.value ?? '', this.passwordControl.value ?? '').subscribe(
                (status) => {
                    console.log(status);
                    if (status === 'success') {
                        this.router.navigate(['/home']);
                    } else {
                        this.showErrorMessage = true;
                        this.submitErrorMessage = status;
                    }
                },
            );
        }
    }
}
