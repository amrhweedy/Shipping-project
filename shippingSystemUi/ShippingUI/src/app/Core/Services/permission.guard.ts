import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionGuard implements CanActivate {
  constructor(private router: Router, private authservice: AuthService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const newState = state as unknown as {
      data: {
        permission: string;
      };
    };
    for (let p of this.authservice.permissions) {
      if (p == newState.data.permission) {
        return true;
      }
    }
    this.router.navigateByUrl('/');
    return false;
  }
}
