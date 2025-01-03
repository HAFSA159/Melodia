import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlaylistsComponent } from './playlists.component';

@NgModule({
  declarations: [PlaylistsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: PlaylistsComponent }
    ])
  ]
})
export class PlaylistsModule { }

