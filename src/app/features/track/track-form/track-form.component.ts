import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Track } from '../../../models/track.model';
import * as TrackActions from '../../../store/track.actions';
import * as ImageActions from '../../../store/image/image.actions';
import {selectCurrentImageUrl} from "../../../store/image/image.selectors";
import {Observable} from "rxjs";

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
  imageUrl$: Observable<string | undefined> = this.store.select(selectCurrentImageUrl);


  constructor(
    private store:  Store<{ image: any }>,
    private router: Router
  ) {
    this.trackForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      artist: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      category: new FormControl('', [Validators.required]),
      imageUrl: new FormControl('', [Validators.required]),
    });
    this.store.select(selectCurrentImageUrl).subscribe((imageUrl) => {
      if (imageUrl) {
        this.trackForm.get('imageUrl')?.setValue(imageUrl);
      }
    });
  }




  ngOnInit() {
    this.categories.sort((a, b) => a.localeCompare(b));

  }

  get f() { return this.trackForm.controls; }


  onAudioUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.trackForm.get('audioFile')?.setValue(file);
    }
  }

  selectedFileName: string | null = null;

  onImageUpload(event: any) {
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (!file) {
      console.warn('No file selected.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      console.error('Invalid file type. Please upload an image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      console.error('File size exceeds the limit of 5MB.');
      return;
    }

    // Show the selected file name
    this.selectedFileName = file.name;

    // Dispatch the image upload action
    this.store.dispatch(
      ImageActions.uploadImage({ image: new File([file], file.name, { type: file.type }) })
    );

    // Clear the file input
    fileInput.value = '';
  }


  addTrack() {
    this.submitted = true;

    if (this.trackForm.valid && this.trackForm.get('imageUrl')?.value) {
      const track: Track = { ...this.trackForm.value };

      this.store.dispatch(TrackActions.addTrack({ track }));
      this.router.navigate(['/library']);
    } else {
      console.error('Form is invalid or image URL is not available.');
    }
  }


}
