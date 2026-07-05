import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, switchMap, filter } from 'rxjs/operators';
import { of } from 'rxjs';

// ✅ CORREGIDO: El tipo de retorno es estrictamente una única CanActivateFn
export const authGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => { // Inyectamos route y state aquí nativamente
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.getUser().pipe(
      take(1),
      switchMap(user => {
        if (!user) {
          return of('user');
        }
        return authService.getUserRole().pipe(
          filter(role => role !== null),
          take(1)
        );
      }),
      map(currentRole => {
        if (allowedRoles.includes(currentRole!)) {
          return true;
        }

        if (currentRole === 'admin') {
          router.navigate(['/dashboard-ong']);
        } else if (currentRole === 'register') {
          router.navigate(['/evaluator']);
        } else {
          router.navigate(['/login']);
        }

        return false;
      })
    );
  };
};