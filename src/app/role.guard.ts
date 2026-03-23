import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

export const roleGuard: CanActivateFn = async (route, state) => {
  const auth = inject(Auth);
  const firestore = inject(Firestore);
  const router = inject(Router);

  const expectedRole = route.data?.['role'];

  if (!auth.currentUser) {
    router.navigate(['/login']);
    return false;
  }

  const ref = doc(firestore, `users/${auth.currentUser.uid}`);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    router.navigate(['/home']);
    return false;
  }

  const userData = snap.data();
  if (userData['role'] === expectedRole) {
    return true;
  } else {
    router.navigate(['/home']);
    return false;
  }
};
