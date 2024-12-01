export interface Movie {
  id: number;
  title: string;
  description: string;
  releaseYear: number;
  genre: string;
  rating: number;
  imageUrl: string;
  director: string;
  actors: string[];
  duration: number;
  price?: number;
  type?: 'rental' | 'purchase';
}

export interface UserMovie {
  movieId: number;
  userId: number;
  type: 'rental' | 'purchase';
  date: Date;
}

export interface NewMovie extends Omit<Movie, 'id' | 'actors'> {
  actorsInput: string;
}