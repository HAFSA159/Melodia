import { createAction, props } from '@ngrx/store';

export const uploadImage = createAction(
  '[Image] Upload Image',
  props<{ image: File }>()
);

export const uploadImageSuccess = createAction(
  '[Image] Upload Image Success',
  props<{ id: any; name: string; url: string }>()
);
export const uploadImageFailure = createAction(
  '[Image] Upload Image Failure',
  props<{ error: any }>()
);

export const retrieveImage = createAction(
  '[Image] Retrieve Image',
  props<{ id: any }>()
);

export const retrieveImageSuccess = createAction(
  '[Image] Retrieve Image Success',
  props<{ url: string; name: string }>()
);

export const retrieveImageFailure = createAction(
  '[Image] Retrieve Image Failure',
  props<{ error: any }>()
);
