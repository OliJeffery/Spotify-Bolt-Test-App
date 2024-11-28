export interface Album {
  id: string;
  name: string;
  artists: Artist[];
  releaseDate: string;
  images: SpotifyImage[];
  genres: string[];
  type: string;
  isFavorited: boolean;
  isListened: boolean;
  pitchforkReview?: PitchforkReview;
}

export interface Artist {
  id: string;
  name: string;
  images: SpotifyImage[];
}

export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface PitchforkReview {
  title: string;
  link: string;
  score: number;
  publishDate: string;
  content: string;
  artist: string;
  albumName: string;
}

export interface UserProfile {
  id: string;
  display_name: string;
  images: SpotifyImage[];
}
