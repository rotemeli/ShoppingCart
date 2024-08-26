import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AccountService } from '../services/account.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private _accountSvc: AccountService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this._accountSvc.currentUser()) {
      return true;
    } else {
      alert('You shall not pass!');
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}
