import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Category } from 'src/app/model/category.model';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  itemsCopy = this.categories;
  categoryItems: number = 0;
  appstate$!: Observable<any>;
  constructor(
    private mainService: MainService,
    private cdref: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getData();
    this.handleState();
    this.mainService.showDarkModeToggle.next(true);
  }

  handleState() {
    this.appstate$ = this.router.events.pipe(
      filter((e) => e instanceof NavigationStart),
      map(() => {
        const currentState = this.router.getCurrentNavigation();
        return currentState?.extras.state;
      })
    );
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  getData() {
    this.mainService.getData().subscribe((res: any) => {
      console.log(res);
      this.categories = res.categories;
      this.itemsCopy = res.categories;
      this.mainService.navbarTitle.next(res.businessName);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.categories = this.itemsCopy.filter((item: Category) => {
      return item.name.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0;
    });
  }

  goToProducts(name: string, category: Category) {
    this.router.navigate([`${name}`], { skipLocationChange: true });
    this.mainService.category.next(category);
  }
}
