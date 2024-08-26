import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
  registrationForm: FormGroup;
  isUserExist = false;

  constructor(
    private fb: FormBuilder,
    private _accountSvc: AccountService,
    private router: Router
  ) {
    this.registrationForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [Validators.required, Validators.minLength(6), this.hasUppercase],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  get getEmailErrorMsg(): string {
    return this.isUserExist ? 'User already exists!' : 'Enter a valid email.';
  }

  hasUppercase(control: AbstractControl): { [key: string]: boolean } | null {
    const value: string = control.value;
    if (value && value === value.toLowerCase()) {
      return { noUppercase: true };
    }
    return null;
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      return { mismatch: true };
    }
    return null;
  }

  register() {
    this._accountSvc.register(this.registrationForm.value).subscribe({
      next: (_) => this.router.navigateByUrl('/login'),
      error: (error) => {
        throw error;
      },
    });
  }

  async onSubmit() {
    try {
      const users: any[] = await firstValueFrom(this._accountSvc.getUsers());

      const email = this.registrationForm.get('email')?.value;

      if (users.some((user: any) => user.email === email)) {
        this.isUserExist = true;
      } else {
        this.register();
        this.registrationForm.reset();
        this.isUserExist = false;
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }
}
