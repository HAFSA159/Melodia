import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { TrackDetailsComponent } from './track-details.component';
import { IndexedDbService } from '../../../core/indexed-db.service';
import { AudioDbService } from '../../../core/audio-db.service';
import { Track } from '../../../models/track.model';

describe('TrackDetailsComponent', () => {
  let component: TrackDetailsComponent;
  let fixture: ComponentFixture<TrackDetailsComponent>;
  let mockIndexedDbService: jasmine.SpyObj<IndexedDbService>;
  let mockAudioDbService: jasmine.SpyObj<AudioDbService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  const mockTracks: Track[] = [
    { id: 1, title: 'Track 1', artist: 'Artist 1', category: 'Category 1', imageUrl: 'url1', duration: 180, createdAt: new Date(), audioId: 1 },
    { id: 2, title: 'Track 2', artist: 'Artist 2', category: 'Category 2', imageUrl: 'url2', duration: 240, createdAt: new Date(), audioId: 2 },
    { id: 3, title: 'Track 3', artist: 'Artist 3', category: 'Category 3', imageUrl: 'url3', duration: 200, createdAt: new Date(), audioId: 3 },
  ];

  const mockAudioFile = new Blob([''], { type: 'audio/mpeg' });

  beforeEach(async () => {
    mockIndexedDbService = jasmine.createSpyObj('IndexedDbService', ['getAllTracks', 'getTrackById']);
    mockAudioDbService = jasmine.createSpyObj('AudioDbService', ['getAudioFile']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      paramMap: of(convertToParamMap({ id: '1' }))
    };

    await TestBed.configureTestingModule({
      declarations: [ TrackDetailsComponent ],
      providers: [
        { provide: IndexedDbService, useValue: mockIndexedDbService },
        { provide: AudioDbService, useValue: mockAudioDbService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    mockIndexedDbService.getAllTracks.and.returnValue(of(mockTracks));
    mockIndexedDbService.getTrackById.and.returnValue(of(mockTracks[0]));
    // @ts-ignore
    mockAudioDbService.getAudioFile.and.returnValue(of({ audioFile: mockAudioFile }));

    fixture = TestBed.createComponent(TrackDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load all tracks on init', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(mockIndexedDbService.getAllTracks).toHaveBeenCalled();
    expect(component.allTracks).toEqual(mockTracks);
    expect(component.currentTrackIndex).toBe(0);
  }));

  it('should load track details when trackId is provided', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(mockIndexedDbService.getTrackById).toHaveBeenCalledWith(1);
    expect(component.track).toEqual(mockTracks[0]);
  }));

  it('should load audio file when track has audioId', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(mockAudioDbService.getAudioFile).toHaveBeenCalledWith(1);
    expect(component.audioFile).toBe(mockAudioFile);
    expect(component.audioUrl).toBeTruthy();
  }));

  it('should navigate to next track', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    component.goToNextTrack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/track/track-details', 2]);
  }));

  it('should not navigate to previous track if at the beginning of the list', fakeAsync(() => {
    component.currentTrackIndex = 0;
    fixture.detectChanges();
    tick();
    component.goToPreviousTrack();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  }));

  it('should play audio when playAudio is called', () => {
    const mockAudioElement = jasmine.createSpyObj('HTMLAudioElement', ['play']);
    component.audioPlayerRef = { nativeElement: mockAudioElement };
    component.playAudio();
    expect(mockAudioElement.play).toHaveBeenCalled();
  });

  it('should pause audio when pauseAudio is called', () => {
    const mockAudioElement = jasmine.createSpyObj('HTMLAudioElement', ['pause']);
    component.audioPlayerRef = { nativeElement: mockAudioElement };
    component.pauseAudio();
    expect(mockAudioElement.pause).toHaveBeenCalled();
  });

  it('should revoke object URL on destroy', () => {
    const mockUrl = 'blob:http://example.com/1234-5678';
    spyOn(URL, 'revokeObjectURL');
    component.audioUrl = mockUrl;
    component.ngOnDestroy();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(mockUrl);
  });
});
