import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppComponent } from './app.component';
import { trackReducer } from './store/reducers/track.reducer';
import { TrackEffects } from './store/effects/track.effects';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    StoreModule.forRoot({ track: trackReducer }),
    EffectsModule.forRoot([TrackEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
