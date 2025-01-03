import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Track } from '../models/track';
import { IndexedDBService } from './indexeddb.service';

@Injectable({
  providedIn: 'root',
})
export class TrackService {
  constructor(private indexedDBService: IndexedDBService) {}

  getTracks(): Observable<Track[]> {
    return from(this.indexedDBService.getAllTracks());
  }

  addTrack(track: Track, audioBlob: Blob): Observable<Track> {
    const newTrack = { ...track, id: Date.now().toString() };
    return from(this.indexedDBService.addTrack(newTrack)).pipe(
      map(() => {
        this.indexedDBService.addAudioFile(newTrack.id, audioBlob);
        return newTrack;
      })
    );
  }

  updateTrack(track: Track): Observable<Track> {
    return from(this.indexedDBService.updateTrack(track));
  }

  deleteTrack(id: string): Observable<void> {
    return from(this.indexedDBService.deleteTrack(id));
  }

  getAudioFile(id: string): Observable<Blob | undefined> {
    return from(this.indexedDBService.getAudioFile(id));
  }
}

