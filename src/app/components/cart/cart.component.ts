import { Component, Inject, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CartData } from 'src/app/model/cart-data.model';
import { CartProduct } from 'src/app/model/cart-product.model';
import { MainService } from 'src/app/services/main.service';
import { SuccessComponent } from '../success/success.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  total: number = 0;
  cartProducts: CartProduct[] = [];
  newElements: any = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CartData,
    private mainService: MainService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.total = this.data.total;
    this.mainService.cart.subscribe((res) => {
      this.cartProducts = res;
    });
  }

  iterateString(productName: string) {
    return this.mainService.iterateString(productName);
  }

  check(itemName: string, event: MatCheckboxChange) {
    if (event.checked) {
      this.data.cartProducts.forEach((element) => {
        if (element.name == itemName) {
          this.total = this.total + element.totalPrice;
          this.cartProducts.push(element);
        }
      });
    } else {
      this.data.cartProducts.forEach((element) => {
        if (element.name == itemName) {
          this.total = this.total - element.totalPrice;
          const index = this.cartProducts.indexOf(element);
          this.cartProducts.splice(index, 1);
        }
      });
    }

    localStorage.setItem('cart', JSON.stringify(this.cartProducts));
  }

  submit() {
    this.mainService.cart.next([]);
    localStorage.setItem('cart', JSON.stringify(this.cartProducts));
    this.dialog.closeAll();
    this.dialog.open(SuccessComponent, {
      panelClass: 'dialog',
    });
  }
}
