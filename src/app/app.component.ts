import { Component, HostBinding } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'dev-demo';
  @HostBinding('class') className: string = '';

  constructor(private overlay: OverlayContainer) {}

  toggleDarkMode(value: boolean) {
    const darkClassName = 'darkMode';
    this.className = value ? darkClassName : '';
    if (this.className == 'darkMode') {
      this.overlay.getContainerElement().classList.add(darkClassName);
    } else {
      this.overlay.getContainerElement().classList.remove(darkClassName);
    }
  }
}
