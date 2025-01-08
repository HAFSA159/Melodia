import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackComponent } from './track.component';
import {TrackDetailsComponent} from "./track-details/track-details.component";
import {TrackFormComponent} from "./track-form/track-form.component";

const routes: Routes = [
  { path: '', component: TrackComponent },
  { path: 'details', component: TrackDetailsComponent },
  { path: 'add', component: TrackFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackRoutingModule { }
