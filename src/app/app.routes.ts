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
    canActivate: [canActivateFn],
    component: TemplateComponent,
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
        path: 'zones/:id',
        component: Zones,
        runGuardsAndResolvers: 'paramsChange'
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
