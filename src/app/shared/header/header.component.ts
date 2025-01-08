import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  public isCollapsed = true;

  collapse() {
    console.log(this.isCollapsed);
    this.isCollapsed = !this.isCollapsed;
  }
}
