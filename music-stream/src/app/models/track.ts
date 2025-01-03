export class Track {
  id: number;
  title: string;
  artist: string;
  genre: string;
  duration: number;

  constructor(id: number, title: string, artist: string, genre: string, duration: number) {
    this.id = id;
    this.title = title;
    this.artist = artist;
    this.genre = genre;
    this.duration = duration;
  }
}
