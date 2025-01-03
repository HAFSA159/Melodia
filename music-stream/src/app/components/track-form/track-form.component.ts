import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Track } from '../../models/track';
import * as TrackActions from '../../store/track/track.actions';

@Component({
  selector: 'app-track-form',
  templateUrl: './track-form.component.html',
  styleUrls: ['./track-form.component.css'],
  standalone: true
})
export class TrackFormComponent implements OnInit {
  trackForm: FormGroup;
  audioFile: File | null = null;

  constructor(private fb: FormBuilder, private store: Store) {
    this.trackForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      artist: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(200)]],
      category: ['', Validators.required],
      audioFile: [null, Validators.required],
    });
  }

  ngOnInit() {}

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (this.isValidAudioFile(file)) {
        this.audioFile = file;
      } else {
        this.audioFile = null;
        this.trackForm.get('audioFile')?.setErrors({ 'invalid': true });
      }
    }
  }

  isValidAudioFile(file: File): boolean {
    const validTypes = ['audio/mp3', 'audio/wav', 'audio/ogg'];
    const maxSize = 15 * 1024 * 1024; // 15MB
    return validTypes.includes(file.type) && file.size <= maxSize;
  }

  calculateAudioDuration(file: File): Promise<number> {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.addEventListener('loadedmetadata', () => {
        resolve(audio.duration);
      });
      audio.src = URL.createObjectURL(file);
    });
  }

  async onSubmit() {
    if (this.trackForm.valid && this.audioFile) {
      const formData = this.trackForm.value;
      const duration = await this.calculateAudioDuration(this.audioFile);

      const track: Track = {
        id: '',  // Will be set by the service
        title: formData.title,
        artist: formData.artist,
        description: formData.description,
        dateAdded: new Date(),  // Using dateAdded consistently
        duration: duration,
        category: formData.category,
        audioUrl: ''  // Will be handled by the service
      };

      // @ts-ignore
      this.store.dispatch(TrackActions.addTrack({ track, audioFile: this.audioFile }));
      this.trackForm.reset();
      this.audioFile = null;
    }
  }
}

