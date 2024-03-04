import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderBarComponent } from './shared/header-bar/header-bar.component';
import { FooterComponent } from './shared/footer/footer.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        HeaderBarComponent,
        FooterComponent,
    ],
    templateUrl: './app.component.html',
})
export class AppComponent {

}
