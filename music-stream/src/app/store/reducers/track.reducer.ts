import { createReducer, on } from '@ngrx/store';
import { loadTracksSuccess, loadTracksFailure, addTrackSuccess, addTrackFailure } from '../actions/track.actions';
import { Track } from '../../models/track';

export interface TrackState {
  tracks: Track[];
  error: any;
}

export const initialState: TrackState = {
  tracks: [],
  error: null
};

export const trackReducer = createReducer(
  initialState,
  on(loadTracksSuccess, (state, { tracks }) => ({
    ...state,
    tracks,
    error: null
  })),
  on(loadTracksFailure, (state, { error }) => ({
    ...state,
    error
  })),
  on(addTrackSuccess, (state, { track }) => ({
    ...state,
    tracks: [...state.tracks, track],
    error: null
  })),
  on(addTrackFailure, (state, { error }) => ({
    ...state,
    error
  }))
);
