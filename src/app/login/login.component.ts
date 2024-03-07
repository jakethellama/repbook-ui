import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
    FormBuilder, Validators, FormsModule, ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterLink,
    ],
    templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {
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

            this.subLoginForm = this.loginForm.statusChanges.subscribe(
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
        this.subLoginForm?.unsubscribe();
    }

    subUserCont?: Subscription;
    subPassCont?: Subscription;
    subLoginForm?: Subscription;

    loginForm = this.formBuilder.group({
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
        return this.loginForm.controls.username;
    }

    get passwordControl() {
        return this.loginForm.controls.password;
    }

    onSubmit(): void {
        if (this.loginForm.invalid) {
            if (this.usernameControl.invalid) {
                this.usernameErrorMessage = 'Username is invalid. ';
            }
            if (this.passwordControl.invalid) {
                this.passwordErrorMessage = 'Password is invalid. ';
            }
            this.showErrorMessage = true;
        } else {
            this.authService.login(this.usernameControl.value ?? '', this.passwordControl.value ?? '').subscribe(
                (status) => {
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
