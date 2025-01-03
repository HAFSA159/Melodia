import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <div class="home-container">
      <h1>Welcome to Melodia</h1>
      <!-- Add home content here -->
    </div>
  `,
  styles: [`
    .home-container {
      padding: 20px;
    }
  `]
})
export class HomeComponent { }

