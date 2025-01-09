import { createReducer, on } from '@ngrx/store';
import { Track } from '../models/track.model';
import * as TrackActions from './track.actions';

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
  on(TrackActions.loadTracksSuccess, (state, { tracks }) => ({ ...state, tracks })),
  on(TrackActions.loadTracksFailure, (state, { error }) => ({ ...state, error })),
  on(TrackActions.addTrackSuccess, (state, { track }) => ({ ...state, tracks: [...state.tracks, track] })),
  on(TrackActions.addTrackFailure, (state, { error }) => ({ ...state, error })),
  on(TrackActions.updateTrackSuccess, (state, { track }) => ({
    ...state,
    tracks: state.tracks.map(t => (t?.id && track?.id && t.id === track.id ? track : t)),
  })),

  on(TrackActions.updateTrackFailure, (state, { error }) => ({ ...state, error })),
  on(TrackActions.deleteTrackSuccess, (state, { trackId }) => ({
    ...state,
    tracks: state.tracks.filter(t => t.id !== Number(trackId))
  })),
  on(TrackActions.deleteTrackFailure, (state, { error }) => ({ ...state, error }))





);
