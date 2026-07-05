import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard'; 
import { roleGuard } from './role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then(m => m.RegisterPage),
  },
  {
    path: 'about',
    loadComponent: () => import('./about/about.page').then(m => m.AboutPage),
  },

  {
    path: 'evaluator',
    loadComponent: () => import('./evaluator/evaluator.page').then(m => m.EvaluatorPage), // O tu EvaluatorPage
   
  },
  {
    path: 'dashboard-ong',
    loadComponent: () => import('./dashboard-ong/dashboard-ong.page').then(m => m.DashboardOngComponent),
    canActivate: [roleGuard],
    data: { role: 'admin' } // 👈 Definimos el rol esperado
  },
  
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];