import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const routes = inject(Router)
  if (localStorage.getItem("authToken") !== null) {
    return true;
  }
  routes.navigate(['/auth'])
  return  false;
};
export const isNotLogin: CanActivateFn = (route, state) => {
  const routes = inject(Router)
  if (localStorage.getItem("authToken") !== null) {
    routes.navigate(['/'])
    return false;
  }
  
  return  true;
};
