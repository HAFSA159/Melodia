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
      description?: string;
      category: string;
      imageUrl: string;
      audioId?: number;
      duration: number;
      createdAt: Date;
      isFavorite?: boolean;
    };
  };
}

export type Track = MusicStreamDB['tracks']['value'];
