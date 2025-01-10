import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as ImageActions from './image.actions';

// Helper functions for IndexedDB
const openDatabase = async () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('ImageDatabase', 1);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('images')) {
        db.createObjectStore('images', { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = (event: any) => resolve(event.target.result);
    request.onerror = (event: any) => reject(event.target.error);
  });
};

@Injectable()
export class ImageEffects {
  constructor(private actions$: Actions) {}

  uploadImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ImageActions.uploadImage),
      mergeMap(async ({ image }) => {
        const db = await openDatabase();
        return new Promise((resolve, reject) => {
          const transaction = db.transaction('images', 'readwrite');
          const store = transaction.objectStore('images');

          const imageBlob = new Blob([image], { type: image.type });
          const request = store.add({ blob: imageBlob, name: image.name });

          request.onsuccess = () => {
            const imageUrl = URL.createObjectURL(imageBlob); // Create Blob URL for immediate use
            resolve(
              ImageActions.uploadImageSuccess({
                id: request.result,
                name: image.name,
                url: imageUrl, // Pass the URL back in the success action
              })
            );
          };

          request.onerror = (event) => reject(event);
        });
      }),
      map((action: any) => action),
      catchError((error) =>
        of(ImageActions.uploadImageFailure({ error: error.message }))
      )
    )
  );

  retrieveImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ImageActions.retrieveImage),
      mergeMap(async ({ id }) => {
        const db = await openDatabase();
        return new Promise((resolve, reject) => {
          const transaction = db.transaction('images', 'readonly');
          const store = transaction.objectStore('images');

          const request = store.get(id);

          request.onsuccess = (event: any) => {
            const record = event.target.result;
            console.log('Retrieved record:', record); // Debug log
            if (record) {
              const url = URL.createObjectURL(record.blob);
              resolve(
                ImageActions.retrieveImageSuccess({
                  url,
                  name: record.name,
                })
              );
            } else {
              console.error('No image found with id:', id); // Debug log
              reject('No image found');
            }
          };

          request.onerror = (event) => {
            console.error('Error retrieving image:', event); // Debug log
            reject(event);
          };
        });
      }),
      map((action: any) => action),
      catchError((error) =>
        of(ImageActions.retrieveImageFailure({ error: error.message }))
      )
    )
  );
}

