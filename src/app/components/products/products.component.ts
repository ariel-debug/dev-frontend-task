import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CartProduct } from 'src/app/model/cart-product.model';
import { Category } from 'src/app/model/category.model';
import { Product } from 'src/app/model/product.model';
import { MainService } from 'src/app/services/main.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CartComponent } from '../cart/cart.component';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper/public-api';
import { SwiperComponent } from 'ngx-swiper-wrapper/public-api';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  category!: Category;
  categorySlides!: any;
  products: Product[] = [];
  productSlide: any = [];
  currentSlide = 0;
  direction = 'RL';
  addedProducts: CartProduct[] = [];

  config: SwiperOptions = {
    observer: true,
    direction: 'horizontal',
    threshold: 0,
    spaceBetween: 16,
    slidesPerView: 1,
    centeredSlides: false,
  };
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
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
    localStorage.setItem('cart', JSON.stringify(this.addedProducts));
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
    localStorage.setItem('cart', JSON.stringify(this.addedProducts));
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

  slideNext() {
    this.swiper?.directiveRef?.nextSlide();
  }
  slidePrev() {
    this.swiper?.directiveRef?.prevSlide();
  }

  indexChange(event: number) {
    this.currentSlide = event;
  }
}
