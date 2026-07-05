import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
// Ajusta la ruta a tu servicio
import { map, take, switchMap, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from './services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Capturamos el rol esperado desde la data de la ruta
  const expectedRole = route.data?.['role'];

  return authService.getUser().pipe(
    take(1),
    switchMap(user => {
      // Si Firebase Auth confirma que no hay sesión, va directo al login
      if (!user) {
        router.navigate(['/login']);
        return of(null);
      }

      // 🔄 Esperamos de forma segura a que el AuthService resuelva el rol desde Firestore
      return authService.getUserRole().pipe(
        filter(role => role !== null), // Bloquea el flujo si está en estado 'Cargando...'
        take(1)
      );
    }),
    map(currentRole => {
      // Si no hay rol (usuario no autenticado o error) ya se manejó la redirección arriba
      if (!currentRole) return false;

      // Validamos si el rol coincide con lo esperado por la ruta
      if (currentRole === expectedRole) {
        return true;
      }

      // Redirección inteligente de seguridad si el rol no coincide
      if (currentRole === 'admin') {
        router.navigate(['/dashboard-ong']);
      } else if (currentRole === 'register') {
        router.navigate(['/evaluator']);
      } else {
        router.navigate(['/home']);
      }

      return false;
    })
  );
};
