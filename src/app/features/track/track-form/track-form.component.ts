import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Track } from '../../../models/track.model';
import * as TrackActions from '../../../store/track.actions';
import {retrieveImage, uploadImage} from "../../../store/image/image.actions";
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
    this.store.select('image').subscribe((state: { currentImageUrl?: string }) => {
      if (state.currentImageUrl) {
        this.trackForm.get('imageUrl')?.setValue(state.currentImageUrl); // Update the form field
      }
    });
  }


  onImageUpload(event: any) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const imageData = reader.result as string;

        // Display the image in the UI or store it in IndexedDB
        const imageUrl = imageData; // This will be a base64 encoded string

        // Alternatively, create a blob URL
        const objectURL = URL.createObjectURL(file);

        // Dispatch to store the image (using either base64 or object URL)
        this.store.dispatch(
          ImageActions.uploadImage({ image: new File([file], file.name, { type: file.type }) })
        );

        // Set imageUrl in the form or state
        this.trackForm.get('imageUrl')?.setValue(objectURL);
      };

      reader.readAsDataURL(file);  // Read the file as a data URL
    }
  }




  ngOnInit() {
    this.categories.sort((a, b) => a.localeCompare(b));

  }

  get f() { return this.trackForm.controls; }


  addTrack() {
    this.submitted = true;
    const track: Track = this.trackForm.value;

    console.log(track, "hello")

    if (this.trackForm.valid) {
      const track: Track = this.trackForm.value;

      this.store.dispatch(TrackActions.addTrack({ track }));
      this.router.navigate(['/library']);
    }
  }

}
