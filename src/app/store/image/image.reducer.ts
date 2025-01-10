import { createReducer, on } from '@ngrx/store';
import * as ImageActions from './image.actions';

export interface ImageState {
  loading: boolean;
  images: { id: number; name: string }[];
  currentImageUrl?: string;
  error?: string;
}

export const initialState: ImageState = {
  loading: false,
  images: [],
};

export const imageReducer = createReducer(
  initialState,
  on(ImageActions.uploadImage, (state) => ({
    ...state,
    loading: true,
    error: undefined,
  })),
  on(ImageActions.uploadImageSuccess, (state, { id, name, url }) => ({
    ...state,
    loading: false,
    images: [...state.images, { id, name }],
    currentImageUrl: url,
  })),
  on(ImageActions.uploadImageFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(ImageActions.retrieveImage, (state) => ({
    ...state,
    loading: true,
    error: undefined,
  })),
  on(ImageActions.retrieveImageSuccess, (state, { url }) => ({
    ...state,
    loading: false,
    currentImageUrl: url,
  })),
  on(ImageActions.retrieveImageFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
