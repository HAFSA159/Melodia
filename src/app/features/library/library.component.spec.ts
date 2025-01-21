import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibraryComponent } from './library.component';
import { StoreModule } from '@ngrx/store';
import { ReactiveFormsModule } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import * as TrackActions from '../../store/track.actions';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

describe('LibraryComponent', () => {
  let component: LibraryComponent;
  let fixture: ComponentFixture<LibraryComponent>;
  let store: MockStore;
  let dispatchSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LibraryComponent],
      imports: [
        StoreModule.forRoot({}),
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(LibraryComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    dispatchSpy = spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load tracks on initialization', () => {
    const loadTracksAction = TrackActions.loadTracks();
    expect(dispatchSpy).toHaveBeenCalledWith(loadTracksAction);
  });

  it('should open the add track modal when "Add Track" button is clicked', () => {
    const addButton = fixture.debugElement.query(By.css('button')).nativeElement;
    addButton.click();

    expect(component.editMode).toBeTrue();
    expect(component.trackForm.valid).toBeFalse();
  });

 /* it('should validate the track form fields', () => {
    const form = component.trackForm;

    form.get('title')?.setValue('');
    form.get('artist')?.setValue('');
    form.get('category')?.setValue('');
    component.submitted = true;

    fixture.detectChanges();

    const errorMessages = fixture.debugElement.queryAll(By.css('.text-red-500'));
    expect(errorMessages.length).toBe(3);
  });
*/
  it('should dispatch addTrack action with valid form data', async () => {
    const form = component.trackForm;
    const testTrack = {
      title: 'Test Track',
      artist: 'Test Artist',
      category: 'Pop',
      description: 'Test Description',
      imageUrl: new File([], 'test.jpg'),
      audioFile: new File([], 'test.mp3'),
    };

    spyOn(component, 'calculateAudioDuration').and.returnValue(Promise.resolve(180));
    spyOn(component, 'convertImageToBase64').and.returnValue(Promise.resolve('base64Image'));

    form.patchValue(testTrack);

    await component.addOrUpdateTrack();

    expect(dispatchSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      type: '[Track] Add Track',
    }));
  });

  it('should dispatch deleteTrack action when deleting a track', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteTrack(1);

    expect(dispatchSpy).toHaveBeenCalledWith(TrackActions.deleteTrack({ trackId: '1' }));
  });

  it('should reset the form when closing the modal', () => {
    component.editMode = true;
    component.trackForm.get('title')?.setValue('Test Title');

    component.closeModal();

    expect(component.editMode).toBeFalse();
    expect(component.trackForm.pristine).toBeTrue();
  });
});
