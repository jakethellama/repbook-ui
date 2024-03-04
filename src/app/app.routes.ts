import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { WorkoutPageComponent } from './workout-page/workout-page.component';
import { IndexComponent } from './index/index.component';

export const routes: Routes = [
    {
        path: '', component: IndexComponent,
    },
    {
        path: 'login', component: LoginComponent,
    },
    {
        path: 'signup', component: SignUpComponent,
    },
    {
        path: 'home', component: HomeComponent,
    },
    {
        path: 'workouts/:id', component: WorkoutPageComponent,
    },
    {
        path: '**', component: PageNotFoundComponent,
    },

];
