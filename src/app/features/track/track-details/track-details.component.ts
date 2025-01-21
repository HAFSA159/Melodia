import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Track } from '../../../models/track.model';
import { IndexedDbService } from '../../../core/indexed-db.service';
import { AudioDbService } from '../../../core/audio-db.service';

@Component({
  selector: 'app-track-details',
  templateUrl: './track-details.component.html',
  styleUrls: ['./track-details.component.scss'],
})
export class TrackDetailsComponent implements OnInit {
  trackId: number | null = null;
  track: Track | null = null;
  audioFile: Blob | null = null;
  audioUrl: string | null = null;
  @ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>;

  allTracks: Track[] = [];
  currentTrackIndex: number = -1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private indexedDbService: IndexedDbService,
    private audioDbService: AudioDbService
  ) {}

  ngOnInit() {
    this.loadAllTracks();
  }

  loadAllTracks() {
    this.indexedDbService.getAllTracks().subscribe((tracks) => {
      this.allTracks = tracks;
      this.route.paramMap.subscribe((params) => {
        const id = params.get('id');
        if (id) {
          this.trackId = +id;
          this.currentTrackIndex = this.allTracks.findIndex(t => t.id === this.trackId);
          this.loadTrackDetails(this.trackId);
        }
      });
    });
  }

  loadTrackDetails(trackId: number) {
    this.indexedDbService.getTrackById(trackId).subscribe((track) => {
      if (track) {
        this.track = track;
        if (track.audioId) {
          this.audioDbService.getAudioFile(track.audioId).subscribe((audio) => {
            if (audio) {
              this.audioFile = audio.audioFile;
              if (this.audioUrl) {
                URL.revokeObjectURL(this.audioUrl);
              }
              this.audioUrl = URL.createObjectURL(audio.audioFile);
            }
          });
        }
      }
    });
  }

  playAudio() {
    if (this.audioPlayerRef) {
      this.audioPlayerRef.nativeElement.play();
    }
  }

  pauseAudio() {
    if (this.audioPlayerRef) {
      this.audioPlayerRef.nativeElement.pause();
    }
  }

  goToNextTrack() {
    if (this.currentTrackIndex < this.allTracks.length - 1) {
      this.currentTrackIndex++;
      this.navigateToTrack(this.allTracks[this.currentTrackIndex].id!);
    }
  }

  goToPreviousTrack() {
    if (this.currentTrackIndex > 0) {
      this.currentTrackIndex--;
      this.navigateToTrack(this.allTracks[this.currentTrackIndex].id!);
    }
  }

  navigateToTrack(trackId: number) {
    this.router.navigate(['/track/track-details', trackId]);
  }

  ngOnDestroy() {
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
    }
  }
}
