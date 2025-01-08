import {DBSchema} from "idb";

export interface MusicStreamDB extends DBSchema {
  audioFiles: {
    key: number;
    value: {
      id?: number;
      fileName: string;
      fileBlob: Blob;
      fileType: string;
      fileSize: number;
      createdAt: Date;
    };
  };
  tracks: {
    key: number;
    value: {
      id?: number;
      title: string;
      artist: string;
      description?: string; // Max 200 characters
      category: string; // E.g., pop, rock, rap, etc.
      duration: number; // Calculated automatically
      createdAt: Date;
    };
  };
}

export type Track = MusicStreamDB['tracks']['value'];
