import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = 'http://localhost:5000/api/products';

  constructor(private _http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this._http.get<Product[]>(this.apiUrl);
  }
}
