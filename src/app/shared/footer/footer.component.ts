import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [
        CommonModule,
    ],
    templateUrl: './footer.component.html',
    styles: '',
})
export class FooterComponent {
    constructor(public authService: AuthService) {}
}
