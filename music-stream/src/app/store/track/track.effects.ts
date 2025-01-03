import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { TrackService } from '../../services/track.service';
import * as TrackActions from './track.actions';

@Injectable()
export class TrackEffects {
  loadTracks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackActions.loadTracks),
      mergeMap(() =>
        this.trackService.getTracks().pipe(
          map(tracks => TrackActions.loadTracksSuccess({ tracks })),
          catchError(error => of(TrackActions.loadTracksFailure({ error })))
        )
      )
    )
  );

  addTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackActions.addTrack),
      mergeMap(({ track }) =>
        this.trackService.addTrack(track).pipe(
          map(newTrack => TrackActions.addTrackSuccess({ track: newTrack })),
          catchError(error => of(TrackActions.addTrackFailure({ error })))
        )
      )
    )
  );

  updateTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackActions.updateTrack),
      mergeMap(({ track }) =>
        this.trackService.updateTrack(track).pipe(
          map(() => TrackActions.updateTrackSuccess({ track })),
          catchError(error => of(TrackActions.updateTrackFailure({ error })))
        )
      )
    )
  );

  deleteTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackActions.deleteTrack),
      mergeMap(({ id }) =>
        this.trackService.deleteTrack(id).pipe(
          map(() => TrackActions.deleteTrackSuccess({ id })),
          catchError(error => of(TrackActions.deleteTrackFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private trackService: TrackService
  ) {}
}

