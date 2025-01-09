import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  trackForm: FormGroup;
  editMode: boolean = false;
  trackToEdit: Track | null = null;
  submitted: boolean = false;
  categories: string[] = [
    'Rock',
    'Pop',
    'Hip Hop',
    'Jazz',
    'Classical',
    'Electronic',
    'Country',
    'Metal',
    'Latin',
    'K-Pop',
    'Indie',
    'Disco',
    'Trap',
    'Techno',
    'House',
    'Opera',
    'Dancehall',
    'World Music',
    'Lo-fi',
    'Chillout',
    'Hardcore',
    'Soundtrack',
    'chaabi'
  ];

  constructor(private store: Store, private fb: FormBuilder) {
    this.tracks$ = this.store.select(fromTrack.selectAllTracks);

    this.trackForm = this.fb.group({
      title: ['', Validators.required],
      artist: ['', Validators.required],
      description: [''],
      category: ['', Validators.required],
    });
  }

  ngOnInit() {this.loadTracks();}

  loadTracks() {this.store.dispatch(TrackActions.loadTracks());}

  deleteTrack(id: number) {
    if (confirm('Are you sure you want to delete this track?')) {
      this.store.dispatch(TrackActions.deleteTrack({ trackId: id.toString() }));
    }
  }

  editTrack(track: Track): void {
    console.log('Editing track:', track);
    this.trackToEdit = track;
    this.editMode = true;
    this.trackForm.patchValue({
      title: track.title,
      artist: track.artist,
      category: track.category,
      description: track.description
    });
  }

  closeModal(): void {
    this.trackToEdit = null;
    this.trackForm.reset();
    this.editMode = false;
  }

  addOrUpdateTrack() {
    this.submitted = true;

    if (this.trackForm.invalid) {
      return;
    }

    const formValue = this.trackForm.value;

    if (this.editMode && this.trackToEdit) {
      const updatedTrack: Track = {
        ...this.trackToEdit,
        title: formValue.title,
        artist: formValue.artist,
        category: formValue.category,
        description: formValue.description
      };
      this.store.dispatch(TrackActions.updateTrack({ track: updatedTrack }));
      this.store.dispatch(TrackActions.loadTracks());
    } else {
      this.store.dispatch(TrackActions.addTrack({ track: formValue }));
    }

    this.resetForm();
  }

  resetForm() {
    this.trackForm.reset();
    this.editMode = false;
    this.trackToEdit = null;
    this.submitted = false;
  }
}
