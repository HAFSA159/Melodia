import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LibraryComponent } from './library.component';
import { TrackListComponent } from '../../components/track-list/track-list.component';
import { DurationPipe } from '../../pipes/duration.pipe';

@NgModule({
  declarations: [
    LibraryComponent,
    TrackListComponent,
    DurationPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: LibraryComponent }
    ])
  ]
})
export class LibraryModule { }

