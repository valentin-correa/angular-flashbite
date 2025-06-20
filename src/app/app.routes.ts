import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { TemplateComponent } from './pages/template/template.component';
import { Zones } from './pages/zones/zones';
import { Delivery } from './pages/delivery/delivery';
import { canActivateFn } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: TemplateComponent,
    //canActivate: [canActivateFn],
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'zones',
        component: Zones
      },
        {
        path: 'deliveries',
        component: Delivery
      }
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent}
];
