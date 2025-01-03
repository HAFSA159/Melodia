import { Component } from '@angular/core';

@Component({
  selector: 'app-playlists',
  template: `
    <div class="playlists-container">
      <h1>My Playlists</h1>
    </div>
  `,
  styles: [`
    .playlists-container {
      padding: 20px;
    }
  `]
})
export class PlaylistsComponent { }

