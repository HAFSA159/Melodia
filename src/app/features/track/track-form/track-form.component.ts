import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Track } from '../../../models/track.model';
import * as TrackActions from '../../../store/track.actions';

@Component({
  selector: 'app-track-form',
  templateUrl: './track-form.component.html',
  styleUrls: ['./track-form.component.scss'],
})
export class TrackFormComponent {
  track: Partial<Track> = {};

  constructor(private store: Store) {}

  addTrack() {
    this.store.dispatch(TrackActions.addTrack({ track: this.track as Track }));
  }
}
