import { Injectable } from '@angular/core';
// @ts-ignore
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Track } from '../models/track';

interface MusicStreamDB extends DBSchema {
  tracks: {
    key: string;
    value: Track;
  };
  audioFiles: {
    key: string;
    value: Blob;
  };
}

@Injectable({
  providedIn: 'root'
})
export class IndexedDBService {
  private dbPromise: Promise<IDBPDatabase<MusicStreamDB>>;

  constructor() {
    this.dbPromise = openDB<MusicStreamDB>('musicStreamDB', 1, {
      upgrade(db: any): void {
        db.createObjectStore('tracks', { keyPath: 'id' });
        db.createObjectStore('audioFiles', { keyPath: 'id' });
      },
    });
  }

  async addTrack(track: Track): Promise<string> {
    const db = await this.dbPromise;
    return db.put('tracks', track);
  }

  async getTrack(id: string): Promise<Track | undefined> {
    const db = await this.dbPromise;
    return db.get('tracks', id);
  }

  async getAllTracks(): Promise<Track[]> {
    const db = await this.dbPromise;
    return db.getAll('tracks');
  }

  async updateTrack(track: Track): Promise<string> {
    const db = await this.dbPromise;
    return db.put('tracks', track);
  }

  async deleteTrack(id: string): Promise<void> {
    const db = await this.dbPromise;
    await db.delete('tracks', id);
    await db.delete('audioFiles', id);
  }

  async addAudioFile(id: string, audioBlob: Blob): Promise<string> {
    const db = await this.dbPromise;
    return db.put('audioFiles', audioBlob, id);
  }

  async getAudioFile(id: string): Promise<Blob | undefined> {
    const db = await this.dbPromise;
    return db.get('audioFiles', id);
  }
}

