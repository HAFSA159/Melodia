import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Track } from '../../models/track.model';
import * as TrackActions from '../../store/track.actions';
import * as fromTrack from '../../store/track.selectors';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
})
export class LibraryComponent implements OnInit {
  tracks$: Observable<Track[]> = of([]);

  constructor(private store: Store) {
    this.tracks$ = this.store.select(fromTrack.selectAllTracks);
  }

  ngOnInit() {
    this.loadTracks();
    console.log(this.tracks$);
  }

  loadTracks() {
    this.store.dispatch(TrackActions.loadTracks());
  }

  deleteTrack(id: number) {
    this.store.dispatch(TrackActions.deleteTrack({ trackId: id.toString() }));
  }
}
