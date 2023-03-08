import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from 'src/app/services/main.service';

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
  constructor(
    private mainService: MainService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.handleNavbarTitle();
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

  navigateBack() {
    this.router.navigateByUrl('');
  }

  ngOnDestroy() {
    this.mainService.navbarTitle.unsubscribe();
  }
}
