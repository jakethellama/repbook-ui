import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../shared/auth.service';

@Component({
    selector: 'app-page-not-found',
    standalone: true,
    imports: [
        RouterLink,
        CommonModule,
    ],
    templateUrl: './page-not-found.component.html',
    styles: '',
})
export class PageNotFoundComponent implements OnInit {
    constructor(public authService: AuthService) {}

    ngOnInit() {
        this.authService.authCheck().subscribe();
    }
}
