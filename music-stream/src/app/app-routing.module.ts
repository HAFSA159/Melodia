import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './components/layout/app-layout.component';

const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'playlists',
        loadChildren: () => import('./pages/playlists/playlists.module').then(m => m.PlaylistsModule)
      },
      {
        path: 'albums',
        loadChildren: () => import('./pages/albums/albums.module').then(m => m.AlbumsModule)
      },
      {
        path: 'library',
        loadChildren: () => import('./pages/library/library.module').then(m => m.LibraryModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

