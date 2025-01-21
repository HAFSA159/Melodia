import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackFormComponent } from './track-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AudioDbService } from './../../../core/audio-db.service';
import { IndexedDbService } from '../../../core/indexed-db.service';
import { selectCurrentImageUrl } from '../../../store/image/image.selectors';
import { Observable, of } from 'rxjs';

// Mocking the AudioDbService
const audioDbServiceMock = jasmine.createSpyObj('AudioDbService', ['addAudioFile']);
const indexedDbServiceMock = jasmine.createSpyObj('IndexedDbService', ['addTrackWithAudio']);

describe('TrackFormComponent', () => {
  let component: TrackFormComponent;
  let fixture: ComponentFixture<TrackFormComponent>;
  let mockStore: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [TrackFormComponent],
      providers: [
        { provide: AudioDbService, useValue: audioDbServiceMock },
        { provide: IndexedDbService, useValue: indexedDbServiceMock },
        provideMockStore({
          selectors: [
            { selector: selectCurrentImageUrl, value: 'http://example.com/test.jpg' },
          ],
        }),
      ],
    }).compileComponents();

    // Initialize the fixture and component
    fixture = TestBed.createComponent(TrackFormComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);

    // Mock the selectors
    mockStore.overrideSelector(selectCurrentImageUrl, 'http://example.com/test.jpg');
    fixture.detectChanges();
  });

  it('should create the TrackFormComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with the correct default values', () => {
    expect(component.trackForm).toBeDefined();
    expect(component.trackForm.controls['title'].value).toBe('');
    expect(component.trackForm.controls['artist'].value).toBe('');
    expect(component.trackForm.controls['category'].value).toBe('');
    expect(component.trackForm.controls['description'].value).toBe('');
  });

  it('should select the current image URL from the store', () => {
    component.imageUrl$.subscribe((url) => {
      expect(url).toBe('http://example.com/test.jpg');
    });
  });


  it('should call addTrack when form is valid and image and audio are provided', () => {
    // Simulating valid form values
    component.trackForm.controls['title'].setValue('Track Title');
    component.trackForm.controls['artist'].setValue('Track Artist');
    component.trackForm.controls['category'].setValue('Pop');
    component.trackForm.controls['imageUrl'].setValue('http://example.com/image.jpg');

    // Simulating audio file upload
    const file = new File([''], 'audio.mp3', { type: 'audio/mp3' });
    component.selectedAudioFile = file;

    // Mock the services' response
    audioDbServiceMock.addAudioFile.and.returnValue(of({ id: 1 }));
    indexedDbServiceMock.addTrackWithAudio.and.returnValue(of(null));

    component.addTrack();
    expect(audioDbServiceMock.addAudioFile).toHaveBeenCalledWith(file);
    expect(indexedDbServiceMock.addTrackWithAudio).toHaveBeenCalled();
  });

});
