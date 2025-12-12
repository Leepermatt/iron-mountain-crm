import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { LeadListComponent } from './leads/lead-list/lead-list.component';
import { LeadFormComponent } from './leads/lead-form/lead-form.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Public login page
  { path: 'login', component: LoginComponent },

  // Everything else requires login
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'leads', pathMatch: 'full' },
      { path: 'leads', component: LeadListComponent },
      { path: 'leads/new', component: LeadFormComponent },
      // we can add an /admin route later when you are ready
    ],
  },

  // Fallback
  { path: '**', redirectTo: '' },
];
