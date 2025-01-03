export interface Track {
  id: string;
  title: string;
  artist: string;
  description?: string;
  dateAdded: Date;
  duration: number;
  category: string;
  audioUrl: string;
}
