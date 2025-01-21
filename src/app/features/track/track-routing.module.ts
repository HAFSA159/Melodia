import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackComponent } from './track.component';
import { TrackFormComponent } from './track-form/track-form.component';
import { TrackDetailsComponent } from './track-details/track-details.component';

const routes: Routes = [
  { path: '', component: TrackComponent },
  { path: 'add', component: TrackFormComponent },
  { path: 'track-details/:id', component: TrackDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrackRoutingModule {}
