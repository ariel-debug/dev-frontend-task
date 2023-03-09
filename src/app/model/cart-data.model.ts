import { CartProduct } from './cart-product.model';

export interface CartData {
  cartProducts: CartProduct[];
  total: number;
}
