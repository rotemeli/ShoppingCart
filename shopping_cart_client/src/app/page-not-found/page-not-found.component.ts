import { Component } from '@angular/core';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css'],
})
export class PageNotFoundComponent {
  constructor(private _accountService: AccountService) {}

  get homepageRoute(): string {
    return this._accountService.currentUser()
      ? '/application/products'
      : '/login';
  }
}
