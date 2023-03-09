import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs';
import { CartProduct } from 'src/app/model/cart-product.model';
import { Category } from 'src/app/model/category.model';
import { Product } from 'src/app/model/product.model';
import { MainService } from 'src/app/services/main.service';

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
  constructor(public mainService: MainService) {}

  ngOnInit(): void {
    this.getCategoryDetails();
    this.products = this.category.products;
    this.splitProducts();
    this.mainService.showDarkModeToggle.next(false);
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

  iterateString(string: string) {
    let returnString = '';
    for (let i = 0; i < string.length; i++) {
      const isUpperCase = this.charAtIsUpper(i, string);
      const isLowerCase = (str: string) => /^[a-z]*$/.exec(str);
      if (isUpperCase) {
        returnString = string[i];
        break;
      } else if (isLowerCase(string[i])) {
        returnString = string[i].toUpperCase();
        break;
      }
    }
    return returnString;
  }

  charAtIsUpper(position: number, string: string) {
    let char = string.charAt(position);
    if (!/[A-Z]|[\u0080-\u024F]/.test(char)) return;
    return char;
  }

  addToCart(productName: string, unitPrice: number) {
    if (!this.addedProducts.find((el) => el.name == productName)) {
      this.addedProducts.push({
        name: productName,
        unitPrice,
        quantity: 1,
      });
    } else if (this.addedProducts.find((el) => el.name == productName)) {
      this.addedProducts.forEach((el) => {
        if (el.name == productName) {
          el.quantity = el.quantity + 1;
        }
      });
    }

    this.mainService.cart.next(this.addedProducts);
  }

  removeFromCart(productName: string, unitPrice: number, index: number) {
    if (!this.addedProducts.find((el) => el.name == productName)) {
      return;
    } else if (this.addedProducts.find((el) => el.name == productName)) {
      this.addedProducts.forEach((el) => {
        if (el.quantity == 1) {
          this.addedProducts = this.addedProducts.splice(index, 1);
        } else {
          el.quantity = el.quantity - 1;
        }
      });
    }

    this.mainService.cart.next(this.addedProducts);
  }

  handleProductBadges(productName: string) {}
}
