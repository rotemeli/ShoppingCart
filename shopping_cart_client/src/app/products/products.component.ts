import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import { CartService } from '../services/cart.service';
import { ProductsService } from '../services/products.service';
import { Product } from '../models/product';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: Product[] | undefined;
  feedbackMessage: string | null = null;
  feedbackMessageType: 'add' | null = null;
  fadeTimeout: any;

  currentProduct: Product | null = null;
  isLoading: boolean = true;

  constructor(
    private _cartService: CartService,
    private _productsService: ProductsService,
  ) {}

  async ngOnInit(): Promise<void> {
    const products: Product[] = await firstValueFrom(
      this._productsService.getProducts()
    );
    this.products = products;

    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  showFeedbackMessage(message: string, type: 'add') {
    clearTimeout(this.fadeTimeout);

    this.feedbackMessage = message;
    this.feedbackMessageType = type;

    this.fadeTimeout = setTimeout(() => {
      this.feedbackMessageType = null;
    }, 2500);
  }

  addToCart(product: Product) {
    this.currentProduct = product; // Keep track of the current product
    this._cartService.addToCart(product);
    this.showFeedbackMessage('Added to cart!', 'add');
  }
}
