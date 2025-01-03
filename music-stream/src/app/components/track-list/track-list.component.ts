import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Track } from '../../models/track';
import * as TrackActions from '../../store/track/track.actions';
import { selectAllTracks } from '../../store/track/track.selector';

@Component({
  selector: 'app-track-list',
  templateUrl: './track-list.component.html',
  standalone: true,
  styleUrls: ['./track-list.component.scss']
})
export class TrackListComponent implements OnInit {
  tracks$: Observable<Track[]>;
  searchQuery: string = '';

  constructor(private store: Store) {
    this.tracks$ = this.store.select(selectAllTracks);
  }

  ngOnInit() {
    this.store.dispatch(TrackActions.loadTracks());
  }

  filterTracks(tracks: Track[]): Track[] {
    if (!this.searchQuery) return tracks;

    const query = this.searchQuery.toLowerCase();
    return tracks.filter(track =>
      track.title.toLowerCase().includes(query) ||
      track.artist.toLowerCase().includes(query) ||
      track.category.toLowerCase().includes(query)
    );
  }
}

