import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';
import { Observable, from } from 'rxjs';
import { MusicStreamDB } from '../models/track.model';
import { AudioDbService } from './audio-db.service';

@Injectable({
  providedIn: 'root',
})
export class IndexedDbService {
  private db!: IDBPDatabase;

  constructor(private audioDbService: AudioDbService) {
    this.initDB().then((r) => console.log('DB initialized'));
  }

  private async initDB() {
    this.db = await openDB('MusicStreamDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('tracks')) {
          const store = db.createObjectStore('tracks', {
            keyPath: 'id',
            autoIncrement: true,
          });
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

  addTrack(
    track: Omit<MusicStreamDB['tracks']['value'], 'id'>
  ): Observable<MusicStreamDB['tracks']['value']> {
    console.log('track', track);
    return from(
      this.db.put('tracks', track).then((id) => {
        return { ...track, id: id as number };
      })
    );
  }

  getAllTracks(): Observable<MusicStreamDB['tracks']['value'][]> {
    return from(
      (async () => {
        await this.ensureDBInitialized(); // Ensure DB is initialized
        return this.db.getAll('tracks');
      })()
    );
  }

  getTrackById(
    id: number
  ): Observable<MusicStreamDB['tracks']['value'] | undefined> {
    return from(this.db.get('tracks', id));
  }

  updateTrack(track: MusicStreamDB['tracks']['value']): Observable<void> {
    return from(this.db.put('tracks', track).then(() => {}));
  }

  deleteTrack(id: number): Observable<void> {
    return from(this.db.delete('tracks', id));
  }

  addTrackWithAudio(
    track: Omit<MusicStreamDB['tracks']['value'], 'id'>,
    audioFile: File
  ): Observable<MusicStreamDB['tracks']['value']> {
    return from(
      (async () => {
        // First, upload the audio file to audiodb
        const audio = await this.audioDbService
          .addAudioFile(audioFile)
          .toPromise();

        // Then, add the track to musicdb with the audioId
        const id = await this.db.put('tracks', {
          ...track,
          audioId: audio?.id,
        });
        return { ...track, id: id as number, audioId: audio?.id };
      })()
    );
  }

  getAllTracksWithAudio(): Observable<
    (MusicStreamDB['tracks']['value'] & { audioFile?: Blob })[]
  > {
    return from(
      (async () => {
        await this.ensureDBInitialized();
        const tracks = await this.db.getAll('tracks');

        // Fetch audio files for each track
        const tracksWithAudio = await Promise.all(
          tracks.map(async (track) => {
            if (track.audioId) {
              const audio = await this.audioDbService
                .getAudioFile(track.audioId)
                .toPromise();
              return { ...track, audioFile: audio?.audioFile };
            }
            return track;
          })
        );

        return tracksWithAudio;
      })()
    );
  }

  getTrackWithAudioById(
    id: number
  ): Observable<MusicStreamDB['tracks']['value'] & { audioFile?: Blob }> {
    return from(
      (async () => {
        await this.ensureDBInitialized();
        const track = await this.db.get('tracks', id);
        if (track?.audioId) {
          const audio = await this.audioDbService
            .getAudioFile(track.audioId)
            .toPromise();
          return { ...track, audioFile: audio?.audioFile };
        }
        return track;
      })()
    );
  }

  deleteTrackWithAudio(id: number): Observable<void> {
    return from(
      (async () => {
        await this.ensureDBInitialized();
        const track = await this.db.get('tracks', id);
        if (track?.audioId) {
          await this.audioDbService.deleteAudioFile(track.audioId).toPromise();
        }
        await this.db.delete('tracks', id);
      })()
    );
  }
}
