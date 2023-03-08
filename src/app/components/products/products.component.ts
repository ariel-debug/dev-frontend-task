import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
        animate('400ms ease-in', style({ transform: 'translateX(0%)' })),
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
  constructor(private mainService: MainService) {}

  ngOnInit(): void {
    this.getCategoryDetails();
    this.products = this.category.products;
    this.splitProducts();
  }

  getCategoryDetails() {
    this.mainService.category.subscribe((res) => {
      this.category = res;
    });
  }

  splitProducts() {
    const chunkSize = 5;
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
      const isUpperCase = (str: string) => /^[A-Z]*$/.test(str);
      const isLowerCase = (str: string) => /^[a-z]*$/.test(str);
      if (isUpperCase(string[i])) returnString = string[i];
      else if (isLowerCase(string[i])) returnString = string[i].toUpperCase();
    }
    return returnString;
  }
}
