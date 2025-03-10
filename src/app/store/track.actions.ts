import { createAction, props } from '@ngrx/store';
import { Track } from '../models/track.model';

export const loadTracks = createAction('[Track] Load Tracks');
export const loadTracksSuccess = createAction('[Track] Load Tracks Success', props<{ tracks: Track[] }>());
export const loadTracksFailure = createAction('[Track] Load Tracks Failure', props<{ error: any }>());

export const addTrack = createAction('[Track] Add Track', props<{ track: Track }>());
export const addTrackSuccess = createAction('[Track] Add Track Success', props<{ track: Track }>());
export const addTrackFailure = createAction('[Track] Add Track Failure', props<{ error: any }>());

export const updateTrack = createAction('[Track] Update Track', props<{ track: Track }>());
export const updateTrackSuccess = createAction('[Track] Update Track Success', props<{ track: Track }>());
export const updateTrackFailure = createAction('[Track] Update Track Failure', props<{ error: any }>());

export const deleteTrack = createAction('[Track] Delete Track', props<{ trackId: string }>());
export const deleteTrackSuccess = createAction('[Track] Delete Track Success', props<{ trackId: string }>());
export const deleteTrackFailure = createAction('[Track] Delete Track Failure', props<{ error: any }>());



export const toggleFavorite = createAction(
  '[Track] Toggle Favorite',
  props<{ trackId: number }>()
);
export const toggleFavoriteSuccess = createAction(
  '[Track] Toggle Favorite Success',
  props<{ trackId: number }>()
);

export const toggleFavoriteFailure = createAction(
  '[Track] Toggle Favorite Failure',
  props<{ error: any }>()
);
