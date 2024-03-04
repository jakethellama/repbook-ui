import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../shared/auth.service';

@Component({
    selector: 'app-index',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
    ],
    templateUrl: './index.component.html',
})
export class IndexComponent implements OnInit {
    constructor(
        public authService: AuthService,
        private router: Router,
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
        }
    }
}
