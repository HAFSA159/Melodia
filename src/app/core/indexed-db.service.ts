import { Injectable } from '@angular/core';
import {openDB, IDBPDatabase} from 'idb';
import { Observable, from } from 'rxjs';
import { MusicStreamDB } from '../models/track.model';

@Injectable({
  providedIn: 'root',
})
export class IndexedDbService {
  private db!: IDBPDatabase;

  constructor() {
    this.initDB().then(r => console.log('DB initialized'));
  }

  private async initDB() {
    this.db = await openDB('MusicStreamDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('tracks')) {
          const store = db.createObjectStore('tracks', { keyPath: 'id', autoIncrement: true });
          store.createIndex('title', 'title', { unique: false });
          store.createIndex('category', 'category', { unique: false });
        }
      },
    });
  }

  private async ensureDBInitialized(): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }
  }

  // Add a new track (Observable)
  addTrack(track: Omit<MusicStreamDB['tracks']['value'], 'id'>): Observable<MusicStreamDB['tracks']['value']> {
    console.log('track', track);
    return from(
      this.db.put('tracks', track).then((id) => {
        return { ...track, id: id as number };
      })
    );
  }

  // Get all tracks (Observable)
  getAllTracks(): Observable<MusicStreamDB['tracks']['value'][]> {
    return from(
      (async () => {
        await this.ensureDBInitialized();  // Ensure DB is initialized
        return this.db.getAll('tracks');
      })()
    );
  }

  // Get a single track by ID (Observable)
  getTrackById(id: number): Observable<MusicStreamDB['tracks']['value'] | undefined> {
    return from(this.db.get('tracks', id));
  }

  // Update a track (Observable)
  updateTrack(track: MusicStreamDB['tracks']['value']): Observable<void> {
    return from(this.db.put('tracks', track).then(() => {}));
  }

  // Delete a track (Observable)
  deleteTrack(id: number): Observable<void> {
    return from(this.db.delete('tracks', id));
  }
}
