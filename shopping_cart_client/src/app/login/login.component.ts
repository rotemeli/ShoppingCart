import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  invalidLogin = false;
  model: any = {};

  constructor(
    private fb: FormBuilder,
    private _accountSvc: AccountService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: [''],
      password: [''],
    });
  }

  login() {
    this._accountSvc.login(this.model).subscribe({
      next: (_) => {
        this.invalidLogin = false;
        this.router.navigateByUrl('/application');
      },
      error: (error) => {
        this.invalidLogin = true;
      },
    });
  }

  onSubmit() {
    try {
      this.model.email = this.loginForm.get('email')?.value;
      this.model.password = this.loginForm.get('password')?.value;
      this.login();
    } catch (error) {
      throw error;
    }
  }
}
