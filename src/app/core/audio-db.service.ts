import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AudioDbService {
  private db!: IDBPDatabase;

  constructor() {
    this.initDB().then(() => console.log('AudioDB initialized'));
  }

  private async initDB() {
    this.db = await openDB('AudioDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('audio')) {
          const store = db.createObjectStore('audio', { keyPath: 'id', autoIncrement: true });
          store.createIndex('fileName', 'fileName', { unique: false });
        }
      },
    });
  }

  private async ensureDBInitialized(): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }
  }

  // Add an audio file (Observable)
  addAudioFile(file: File): Observable<{ id: number; fileName: string; audioFile: Blob }> {
    return from(
      (async () => {
        await this.ensureDBInitialized();
        const id = await this.db.add('audio', { fileName: file.name, audioFile: file });
        return { id: id as number, fileName: file.name, audioFile: file };
      })()
    );
  }

  // Get an audio file by ID (Observable)
  getAudioFile(id: number): Observable<{ fileName: string; audioFile: Blob } | undefined> {
    return from(
      (async () => {
        await this.ensureDBInitialized();
        return this.db.get('audio', id);
      })()
    );
  }

  // Delete an audio file by ID (Observable)
  deleteAudioFile(id: number): Observable<void> {
    return from(
      (async () => {
        await this.ensureDBInitialized();
        await this.db.delete('audio', id);
      })()
    );
  }
}
