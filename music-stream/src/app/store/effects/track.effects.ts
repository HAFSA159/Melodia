import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { TrackService } from '../../services/track.service';
import { loadTracks, loadTracksSuccess, loadTracksFailure, addTrack, addTrackSuccess, addTrackFailure } from '../actions/track.actions';

@Injectable()
export class TrackEffects {

  constructor(
    private actions$: Actions,
    private trackService: TrackService
  ) {}

  loadTracks$ = createEffect(() => this.actions$.pipe(
    ofType(loadTracks),
    switchMap(() =>
      this.trackService.getTracks().pipe(
        map(tracks => loadTracksSuccess({ tracks })),
        catchError(error => of(loadTracksFailure({ error })))
      )
    )
  ));

  addTrack$ = createEffect(() => this.actions$.pipe(
    ofType(addTrack),
    switchMap(({ track }) =>
      this.trackService.addTrack(track).pipe(
        map(newTrack => addTrackSuccess({ track: newTrack })),
        catchError(error => of(addTrackFailure({ error })))
      )
    )
  ));
}
