import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Track } from '../models/track';

@Injectable({
  providedIn: 'root'
})
export class TrackService {

  private apiUrl = 'https://api.example.com/tracks';

  constructor(private http: HttpClient) { }

  getTracks(): Observable<Track[]> {
    return this.http.get<Track[]>(this.apiUrl);
  }

  getTrack(id: number): Observable<Track> {
    return this.http.get<Track>(`${this.apiUrl}/${id}`);
  }

  addTrack(track: Track): Observable<Track> {
    return this.http.post<Track>(this.apiUrl, track);
  }

  updateTrack(track: Track): Observable<Track> {
    return this.http.put<Track>(`${this.apiUrl}/${track.id}`, track);
  }

  deleteTrack(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
