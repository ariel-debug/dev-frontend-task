import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlSegment } from '@angular/router';
import { CategoriesComponent } from './components/categories/categories.component';
import { ProductsComponent } from './components/products/products.component';

const routes: Routes = [
  { path: '', component: CategoriesComponent },
  {
    matcher: (t) =>
      t.length
        ? { consumed: t, posParams: { path: new UrlSegment(t.join('/'), {}) } }
        : null,
    component: ProductsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
