import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartProduct } from 'src/app/model/cart-product.model';
import { Category } from 'src/app/model/category.model';
import { Product } from 'src/app/model/product.model';
import { MainService } from 'src/app/services/main.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CartComponent } from '../cart/cart.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  animations: [
    trigger('carouselAnimation', [
      transition('void => *', [
        style({ transform: 'translateX({{direction}}%)' }),
        animate('400ms ease-out', style({ transform: 'translateX(0%)' })),
      ]),
    ]),
  ],
})
export class ProductsComponent implements OnInit {
  category!: Category;
  categorySlides!: any;
  products: Product[] = [];
  productSlide: any = [];
  currentSlide = 0;
  direction = 'RL';
  addedProducts: CartProduct[] = [];
  constructor(public mainService: MainService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getCategoryDetails();
    this.products = this.category.products;
    this.splitProducts();
    this.mainService.showDarkModeToggle.next(false);
    this.mainService.cart.subscribe((res) => {
      this.addedProducts = res;
    });
  }

  getCategoryDetails() {
    this.mainService.category.subscribe((res) => {
      this.category = res;
    });
  }

  splitProducts() {
    const chunkSize = 6;
    for (let i = 0; i < this.products.length; i += chunkSize) {
      const chunk = this.products.slice(i, i + chunkSize);
      this.productSlide.push(chunk);
    }
  }

  onPreviousClick() {
    this.direction = 'LR';
    const previous = this.currentSlide - 1;
    this.currentSlide = previous < 0 ? this.productSlide.length - 1 : previous;
  }

  onNextClick() {
    this.direction = 'RL';
    const next = this.currentSlide + 1;
    this.currentSlide = next === this.productSlide.length ? 0 : next;
  }

  iterateString(productName: string) {
    return this.mainService.iterateString(productName);
  }

  addToCart(productName: string, unitPrice: number) {
    if (!this.addedProducts.find((el) => el.name == productName)) {
      this.addedProducts.push({
        name: productName,
        unitPrice,
        quantity: 1,
        totalPrice: unitPrice * 1,
      });
    } else if (this.addedProducts.find((el) => el.name == productName)) {
      this.addedProducts.forEach((el) => {
        if (el.name == productName) {
          el.quantity = el.quantity + 1;
          el.totalPrice = el.unitPrice * el.quantity;
        }
      });
    }

    this.mainService.cart.next(this.addedProducts);
  }

  removeFromCart(productName: string, product: Product) {
    if (this.addedProducts.find((el) => el.name == productName)) {
      this.addedProducts.forEach((element) => {
        if (element.quantity == 1 && element.name == product.name) {
          const index = this.addedProducts.indexOf(element);
          this.addedProducts.splice(index, 1);
        } else if (element.quantity > 1 && element.name == product.name) {
          element.quantity = element.quantity - 1;
          element.totalPrice = element.totalPrice - element.unitPrice;
        }
      });
    }

    this.mainService.cart.next(this.addedProducts);
  }

  handleProductBadges(productName: string) {
    let badgeNr = 0;
    this.addedProducts.forEach((el) => {
      if (el.name == productName) badgeNr = el.quantity;
    });
    return badgeNr;
  }

  handleButtonVisibility(productName: string) {
    let visibility = false;
    this.addedProducts.forEach((element) => {
      if (element.name == productName) visibility = true;
    });
    return visibility;
  }

  openDialog() {
    let total = 0;
    this.addedProducts.forEach((el) => {
      total = total + el.totalPrice;
    });
    this.dialog.open(CartComponent, {
      panelClass: 'dialog',
      data: {
        cartProducts: this.addedProducts,
        total,
      },
    });
  }
}
