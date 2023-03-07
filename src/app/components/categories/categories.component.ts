import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  constructor(
    private mainService: MainService,
    private cdref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  getData() {
    this.mainService.getData().subscribe((res: any) => {
      console.log(res);
      this.categories = res.categories;
      this.itemsCopy = res.categories;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.categories = this.itemsCopy.filter((item: Category) => {
      return item.name.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0;
    });
  }
}
