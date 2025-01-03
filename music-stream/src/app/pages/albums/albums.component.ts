import { Component } from '@angular/core';

@Component({
  selector: 'app-albums',
  template: `
    <div class="albums-container">
      <h1>Albums</h1>
      <!-- Add albums content here -->
    </div>
  `,
  styles: [`
    .albums-container {
      padding: 20px;
    }
  `]
})
export class AlbumsComponent { }

