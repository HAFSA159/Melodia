import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TrackState } from './track.reducer';

export const selectTrackState = createFeatureSelector<TrackState>('track');

export const selectAllTracks = createSelector(
  selectTrackState,
  (state: TrackState) => state.tracks
);

export const selectTrackLoading = createSelector(
  selectTrackState,
  (state: TrackState) => state.loading
);

export const selectTrackError = createSelector(
  selectTrackState,
  (state: TrackState) => state.error
);

