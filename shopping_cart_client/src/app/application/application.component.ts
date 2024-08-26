import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {
  loggedInUserEmail: string | undefined;

  constructor(
    private _accountSvc: AccountService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loggedInUserEmail = this._accountSvc.currentUser()?.email;
  }

  logout() {
    this._accountSvc.logout();
    this.router.navigateByUrl('/login');
  }
}
