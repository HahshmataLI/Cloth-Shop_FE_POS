import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(Auth);
  const router = inject(Router);
  const allowedRoles = route.data?.['roles'] as string[];

  if (auth.isLoggedIn() && allowedRoles.includes(auth.getUserRole()!)) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
