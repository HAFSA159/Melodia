import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Track } from '../../models/track.model';
import * as TrackActions from '../../store/track.actions';
import * as fromTrack from '../../store/track.selectors';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {map} from "rxjs/operators";

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
})
export class LibraryComponent implements OnInit {
  tracks$: Observable<Track[]>;
  trackForm: FormGroup;
  editMode: boolean = false;
  trackToEdit: Track | null = null;
  submitted: boolean = false;
  ListFavoris = false;
  categories: string[] = [
    'Rock', 'Pop', 'Hip Hop', 'Jazz', 'Classical', 'Electronic', 'Country',
    'Metal', 'Latin', 'K-Pop', 'Indie', 'Disco', 'Trap', 'Techno', 'House',
    'Opera', 'Dancehall', 'World Music', 'Lo-fi', 'Chillout', 'Hardcore',
    'Soundtrack', 'Chaabi'
  ];

  constructor(
    private store: Store,
    private router: Router,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
    this.tracks$ = this.store.select(fromTrack.selectAllTracks);
    this.trackForm = this.fb.group({
      title: ['', Validators.required],
      artist: ['', Validators.required],
      description: [''],
      category: ['', Validators.required],
      imageUrl: new FormControl('', [Validators.required]),
      audioFile: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.loadTracks();
    this.tracks$ = this.store.select(fromTrack.selectAllTracks).pipe(
      map((tracks) =>
        this.ListFavoris ? tracks.filter((track) => track.isFavorite) : tracks
      )
    );
  }

  loadTracks() {
    this.store.dispatch(TrackActions.loadTracks());
  }

  deleteTrack(id: number) {
    if (confirm('Are you sure you want to delete this track?')) {
      this.store.dispatch(TrackActions.deleteTrack({ trackId: id.toString() }));
    }
  }

  onAudioUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.trackForm.get('audioFile')?.setValue(file);
    }
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.trackForm.get('imageUrl')?.setValue(file);
    }
  }

  getSafeImageUrl(url: string | undefined): SafeUrl | null {
    return url ? this.sanitizer.bypassSecurityTrustUrl(url) : null;
  }

  editTrack(track: Track): void {
    console.log('Editing track:', track);
    this.trackToEdit = track;
    this.editMode = true;
    this.trackForm.patchValue({
      title: track.title,
      artist: track.artist,
      category: track.category,
      description: track.description,
    });
  }

  closeModal(): void {
    this.trackToEdit = null;
    this.trackForm.reset();
    this.editMode = false;
    this.submitted = false;
  }

  async addOrUpdateTrack() {
    this.submitted = true;

    if (this.trackForm.invalid) {
      return;
    }

    const formValue = this.trackForm.value;

    try {
      const duration = await this.calculateAudioDuration(formValue.audioFile);

      let imageBase64 = '';
      if (formValue.imageUrl) {
        imageBase64 = await this.convertImageToBase64(formValue.imageUrl);
      }

      const createdAt = new Date();

      const track: Track = {
        title: formValue.title,
        artist: formValue.artist,
        category: formValue.category,
        description: formValue.description,
        imageUrl: imageBase64,
        duration: duration,
        createdAt: createdAt,
        isFavorite: false,
      };

      if (this.editMode && this.trackToEdit) {
        const updatedTrack: Track = {
          ...this.trackToEdit,
          ...track, // Merge the updated values
        };
        this.store.dispatch(TrackActions.updateTrack({ track: updatedTrack }));
      } else {
        this.store.dispatch(TrackActions.addTrack({ track }));
      }

      this.store.dispatch(TrackActions.loadTracks());
      this.resetForm();
    } catch (error) {
      console.error('Error processing track:', error);
    }
  }

  // Convert image to base64
  convertImageToBase64(imageFile: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string); // base64 string
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageFile);
    });
  }

  async calculateAudioDuration(audioFile: File | null): Promise<number> {
    if (!audioFile) return 0;

    const audio = new Audio();
    audio.src = URL.createObjectURL(audioFile);

    return new Promise<number>((resolve, reject) => {
      audio.onloadedmetadata = () => {
        resolve(audio.duration); // duration is in seconds
      };

      audio.onerror = (err) => {
        reject(err);
      };
    });
  }

  resetForm() {
    this.trackForm.reset();
    this.editMode = false;
    this.trackToEdit = null;
    this.submitted = false;
  }

  goToTrackDetails(id: number | undefined) {
    if (id !== undefined) {
      this.router.navigate(['/track/track-details', id]);
    }
  }
  toggleFavorite(trackId: number): void {
    this.store.dispatch(TrackActions.toggleFavorite({ trackId }));
  }

  onToggleFavorite(trackId: number): void {
    this.toggleFavorite(trackId);
  }


  showFavorite(): void {
    this.ListFavoris = true;
    this.tracks$ = this.store.select(fromTrack.selectAllTracks).pipe(
      map((tracks) => tracks.filter((track) => track.isFavorite))
    );
  }

  showTracks(): void {
    this.ListFavoris = false;
    this.tracks$ = this.store.select(fromTrack.selectAllTracks);
  }


}
