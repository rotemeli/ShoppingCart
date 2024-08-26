import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { User } from '../models/user';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl: string = 'http://localhost:5000/api/';
  currentUser = signal<User | null>(null);

  constructor(private _http: HttpClient) {}

  register(model: any) {
    return this._http.post<User>(this.baseUrl + 'account/register', model);
  }

  login(model: any) {
    return this._http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((user) => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
  }

  getUsers() {
    return this._http.get<User[]>(this.baseUrl + 'users');
  }
}
