import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ImageState } from './image.reducer';

export const selectImageState = createFeatureSelector<ImageState>('image');

export const selectCurrentImageUrl = createSelector(
  selectImageState,
  (state: ImageState) => state.currentImageUrl
);
