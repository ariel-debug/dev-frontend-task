import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartProduct } from '../model/cart-product.model';
import { Category } from '../model/category.model';
import { Product } from '../model/product.model';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  navbarTitle: BehaviorSubject<string> = new BehaviorSubject<string>(
    'Categories'
  );
  category: BehaviorSubject<Category> = new BehaviorSubject<Category>({
    id: 0,
    name: '',
    products: [],
  });
  showDarkModeToggle: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );
  cart: BehaviorSubject<CartProduct[]> = new BehaviorSubject<CartProduct[]>([]);
  constructor(private httpClient: HttpClient) {}

  getData() {
    return this.httpClient.get('https://test.dev.al/test/');
  }

  charAtIsUpper(position: number, string: string) {
    let char = string.charAt(position);
    if (!/[A-Z]|[\u0080-\u024F]/.test(char)) return;
    return char;
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
}
