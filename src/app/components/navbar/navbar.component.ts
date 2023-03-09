import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CartProduct } from 'src/app/model/cart-product.model';
import { MainService } from 'src/app/services/main.service';
import { CartComponent } from '../cart/cart.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  modeToggler: boolean = false;
  navbarTitle: string = '';
  @Output() darkModeEmmitter: EventEmitter<boolean> = new EventEmitter<boolean>(
    false
  );
  showDarkModeToggle: boolean = true;
  cartNr = 0;
  addedProducts: CartProduct[] = [];
  constructor(
    public mainService: MainService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.handleNavbarTitle();
    this.handleToggleVisibility();
    this.mainService.cart.subscribe((res) => {
      this.addedProducts = res;
    });
  }

  toggleDarkMode() {
    this.modeToggler = !this.modeToggler;
    this.darkModeEmmitter.emit(this.modeToggler);
  }

  handleNavbarTitle() {
    this.mainService.navbarTitle.subscribe((res) => {
      this.navbarTitle = res;
    });
  }

  handleToggleVisibility() {
    this.mainService.showDarkModeToggle.subscribe((res) => {
      this.showDarkModeToggle = res;
    });
  }

  handleCartBadge() {
    let badgeNr = 0;
    this.mainService.cart.subscribe((res) => {
      res.forEach((el) => {
        badgeNr = badgeNr + el.quantity;
      });
    });

    return badgeNr;
  }

  navigateBack() {
    this.router.navigateByUrl('');
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

  ngOnDestroy() {
    this.mainService.navbarTitle.unsubscribe();
  }
}
