import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable, empty } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AccessService } from '../services/access.service';
import { take, map } from 'rxjs/operators';

@Injectable()
export class MemberGuard implements CanActivate {
  constructor(
    private router: Router,
    private accessService: AccessService,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Params
    const user_id = this.authService.getUserID();
    const queryTeamBy = 'url';
    const gueryTeamValue = route.params.url;
    const question = 'is_member';

    // Check status
    return this.accessService
      .getStatus(user_id, queryTeamBy, gueryTeamValue, question)
      .pipe(
        take(1),
        map((resp) => {
          if (!resp) {
            this.router.navigate(['/app']);
            return false;
          }
          return true;
        })
      );
  }
}
