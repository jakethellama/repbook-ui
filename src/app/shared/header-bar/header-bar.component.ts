import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-header-bar',
    standalone: true,
    imports: [
        CommonModule,

    ],
    templateUrl: './header-bar.component.html',
    styles: '',
})
export class HeaderBarComponent {
    constructor(
        private authService: AuthService,
        private router: Router,
    ) {}

    get path() {
        return this.router.url;
    }

    getHeaderIcon(): string {
        if (this.router.url === '/home') {
            return 'book';
        }

        if (this.router.url.substring(0, 9) === '/workouts') {
            return 'weight';
        }

        return '';
    }

    goHome() {
        this.router.navigate(['/home']);
    }

    logout() {
        this.authService.logout().subscribe(
            (status) => {
                if (status === 'success') {
                    this.router.navigate(['/']);
                }
            },
        );
    }
}
