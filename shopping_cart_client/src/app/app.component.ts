import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from './services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title: string = 'Shopping Cart';

  constructor(private _accountSvc: AccountService, private router: Router) {}
  
  ngOnInit(): void {
    this.setCurrentUser();
    if (this._accountSvc.currentUser()) {
      // Redirect to application if a user is already logged in
      this.router.navigateByUrl('/application');
    }
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user = JSON.parse(userString);
    this._accountSvc.setCurrentUser(user);
  }
  
}
