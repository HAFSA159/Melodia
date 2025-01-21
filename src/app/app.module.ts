import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { TrackDetailsComponent } from './features/track/track-details/track-details.component';
import { SharedModule } from './shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TrackEffects } from './store/track.effects';
import { trackReducer } from './store/track.reducer';
import { HomeComponent } from './features/home/home.component';
import { TrackModule } from './features/track/track.module';
import { imageReducer } from './store/image/image.reducer';
import { ImageEffects } from './store/image/image.effects';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    TrackModule,
    SharedModule,
    StoreModule.forRoot({ tracks: trackReducer, image: imageReducer }),
    EffectsModule.forRoot([TrackEffects, ImageEffects]),
  ],
  providers: [provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
