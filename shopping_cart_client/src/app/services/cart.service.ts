import { Injectable } from '@angular/core';
import { CartItem } from '../models/cart-item';
import { Product } from '../models/product';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { AccountService } from './account.service';
import { Cart } from '../models/cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl: string = 'http://localhost:5000/api/carts';
  private cartItems: CartItem[] = [];
  private userId: string | undefined;

  constructor(private _http: HttpClient, private _accountSvc: AccountService) {
    this.initializeUserId();
  }

  private initializeUserId() {
    this.userId = this._accountSvc.currentUser()?.id;
    if (!this.userId) {
      console.log('No user ID found. The cart will not be loaded or saved.');
    }
  }

  getCart(userId: string): Observable<Cart> {
    return this._http.get<Cart>(`${this.apiUrl}/${userId}`);
  }

  updateCart(userId: string, items: CartItem[]): Observable<any> {
    const body = {
      "userId": this.userId,
      "items": items
    };
    return this._http.put(`${this.apiUrl}/${userId}`, body);
  }

  getCartItems(): CartItem[] {
    // copy of the cart, so the original cart in the service remains unchanged
    return [...this.cartItems];
  }

  async addToCart(product: Product) {
    const existingItemIndex = this.cartItems.findIndex(
      (cartItem) => cartItem.name === product.name
    );

    if (existingItemIndex === -1) {
      const cartItem: CartItem = { ...product, quantity: 1 };
      this.cartItems.push(cartItem);
    } else {
      this.cartItems[existingItemIndex].quantity += 1;
    }
    await this.saveCartToDatabase();
  }

  async removeFromCart(item: any) {
    const existingItemIndex = this.cartItems.findIndex(
      (cartItem) => cartItem.name === item.name
    );

    if (existingItemIndex !== -1) {
      if (this.cartItems[existingItemIndex].quantity > 1) {
        this.cartItems[existingItemIndex].quantity -= 1;
      } else {
        this.cartItems.splice(existingItemIndex, 1);
      }
    }
    await this.saveCartToDatabase(); // Save updated cart to MongoDB
  }

  async loadCartFromDatabase() {
    try {
      if (!this.userId) return;
      const cart: Cart = await firstValueFrom(this.getCart(this.userId));
      this.cartItems = cart.items;
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  }

  private async saveCartToDatabase() {
    try {
      if (!this.userId) return;
      await firstValueFrom(this.updateCart(this.userId, this.cartItems));
    } catch (error) {
      console.error('Failed to save cart:', error);
    }
  }

  getTotal(): string {
    let totalAmount = 0;
    this.cartItems.forEach((item) => {
      const price = item.price;
      totalAmount += price * item.quantity;
    });
    return `$${totalAmount.toFixed(2)}`;
  }

  async clearCart() {
    this.cartItems = [];
    await this.saveCartToDatabase();
  }
}
