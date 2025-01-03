import { Component } from '@angular/core';

@Component({
  selector: 'app-library',
  template: `
    <div class="library-container">
      <app-track-list></app-track-list>
    </div>
  `,
  styles: [`
    .library-container {
      height: 100%;
    }
  `]
})
export class LibraryComponent { }

