import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  modeToggler: boolean = false;
  @Output() darkModeEmmitter: EventEmitter<boolean> = new EventEmitter<boolean>(
    false
  );
  constructor() {}

  ngOnInit(): void {}

  toggleDarkMode() {
    this.modeToggler = !this.modeToggler;
    this.darkModeEmmitter.emit(this.modeToggler);
  }
}
