import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
  constructor(private httpClient: HttpClient) {}

  getData() {
    return this.httpClient.get('https://test.dev.al/test/');
  }
}