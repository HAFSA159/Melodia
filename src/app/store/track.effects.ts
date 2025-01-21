import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, mergeMap, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {TracksService} from '../features/services/tracks.service';
import * as TrackActions from './track.actions';
import {Track} from "../models/track.model";

@Injectable()
export class TrackEffects {
  constructor(
    private actions$: Actions,
    private trackService: TracksService
  ) {
  }

  loadTracks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackActions.loadTracks),
      mergeMap(() =>
        this.trackService.getAllTracks().pipe(
          map(tracks => TrackActions.loadTracksSuccess({tracks})),
          catchError(error => of(TrackActions.loadTracksFailure({error})))
        )
      )
    )
  );

  addTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackActions.addTrack),
      mergeMap(action =>
        this.trackService.addTrack(action.track).pipe(
          map(track => TrackActions.addTrackSuccess({track})),
          catchError(error => of(TrackActions.addTrackFailure({error})))
        )
      )
    )
  );

  updateTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackActions.updateTrack),
      mergeMap(action =>
        this.trackService.updateTrack(action.track).pipe(
          map(track => {
            const updatedTrack: Track = track as unknown as {
              id?: number;
              title: string;
              artist: string;
              description?: string;
              category: string;
              imageUrl: string;
              duration: number;
              createdAt: Date;
            };
            return TrackActions.updateTrackSuccess({ track: updatedTrack });
          }),
          catchError(error => of(TrackActions.updateTrackFailure({ error })))
        )
      )
    )
  );
  deleteTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackActions.deleteTrack),
      mergeMap(action =>
        this.trackService.deleteTrack(Number(action.trackId)).pipe(
          map(() => TrackActions.deleteTrackSuccess({trackId: action.trackId})),
          catchError(error => of(TrackActions.deleteTrackFailure({error})))
        )
      )
    )
  );

  toggleFavorite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrackActions.toggleFavorite),
      switchMap(({ trackId }) =>
        this.trackService.toggleFavorite(trackId).pipe(
          map(() => TrackActions.toggleFavoriteSuccess({ trackId })),
          catchError((error) =>
            of(TrackActions.toggleFavoriteFailure({ error }))
          )
        )
      )
    )
  );
}
