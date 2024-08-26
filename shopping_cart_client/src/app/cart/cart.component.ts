import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CartItem } from '../models/cart-item';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  isLoading: boolean = true;

  fadeTimeout: any; // holds the reference for the setTimeout
  feedbackMessage: string | null = null;
  feedbackMessageType: 'add' | 'remove' | 'clear' | 'fade-out' | null = null;

  constructor(private _cartService: CartService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    await this._cartService.loadCartFromDatabase();
    this.isLoading = false;
    this.refreshCartItems();
  }

  showFeedbackMessage(message: string, type: 'add' | 'remove' | 'clear') {
    clearTimeout(this.fadeTimeout);
    this.feedbackMessage = message;
    this.feedbackMessageType = type;

    this.fadeTimeout = setTimeout(() => {
      this.feedbackMessageType = null;
    }, 2500);

    setTimeout(() => {
      if (this.feedbackMessageType === null) {
        this.feedbackMessage = null;
      }
    }, 2800);
  }

  addToCart(item: CartItem) {
    this._cartService.addToCart(item);
    this.feedbackMessage = `${item.name} added to cart.`;
    this.showFeedbackMessage(`${item.name} added to cart.`, 'add');
  }

  removeFromCart(item: CartItem) {
    this._cartService.removeFromCart(item);
    this.feedbackMessage = `${item.name} removed from cart.`;
    this.refreshCartItems(); // Make sure this line is there
    this.showFeedbackMessage(`${item.name} removed from cart.`, 'remove');
  }

  getTotal(): string {
    return this._cartService.getTotal();
  }

  clearAllItems() {
    this._cartService.clearCart();
    this.refreshCartItems();
    this.feedbackMessage = 'All items cleared from cart.';
    this.showFeedbackMessage('All items cleared from cart.', 'clear');
  }

  private refreshCartItems(): void {
    this.cartItems = this._cartService.getCartItems();
  }

  checkout() {
    this.clearAllItems();
    this.router.navigateByUrl('/application/thanks');
  }
}
