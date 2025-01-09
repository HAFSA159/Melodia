import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Track } from '../../../models/track.model';
import * as TrackActions from '../../../store/track.actions';

@Component({
  selector: 'app-track-form',
  templateUrl: './track-form.component.html',
  styleUrls: ['./track-form.component.scss'],
})
export class TrackFormComponent implements OnInit {
  trackForm: FormGroup;
  submitted = false;
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


  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private router: Router
  ) {
    this.trackForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      artist: ['', [Validators.required]],
      description: [''],
      category: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.categories.sort((a, b) => a.localeCompare(b));
    this.trackForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      artist: ['', [Validators.required]],
      description: [''],
      category: ['', [Validators.required]]
    });
  }

  get f() { return this.trackForm.controls; }

  addTrack() {
    this.submitted = true;

    if (this.trackForm.valid) {
      const track: Track = this.trackForm.value;
      this.store.dispatch(TrackActions.addTrack({ track }));
      this.router.navigate(['/library']);
    }
  }
}
