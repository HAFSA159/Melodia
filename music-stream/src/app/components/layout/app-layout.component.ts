import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent {
  navItems = [
    { icon: 'home', label: 'Home', route: '/home' },
    { icon: 'list', label: 'Playlists', route: '/playlists' },
    { icon: 'album', label: 'Albums', route: '/albums' },
    { icon: 'library_music', label: 'Library', route: '/library' },
    { icon: 'logout', label: 'Logout', route: '/logout' }
  ];
}

