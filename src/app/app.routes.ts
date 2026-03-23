import { Routes } from '@angular/router';

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
    path: 'evaluator',
    loadComponent: () => import('./evaluator/evaluator.page').then(m => m.EvaluatorPage),
  },
  {
    path: 'about',
    loadComponent: () => import('./about/about.page').then(m => m.AboutPage),
  },
  {
    path: 'dashboard-ong',
    loadComponent: () => import('./dashboard-ong/dashboard-ong.page').then(m => m.DashboardOngComponent),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];


