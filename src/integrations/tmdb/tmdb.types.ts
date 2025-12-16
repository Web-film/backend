export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbGenreResponse {
  genres: TmdbGenre[];
}

export interface TmdbTrendingMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string | null;
  genre_ids: number[];
  vote_average: number;
  vote_count: number;
  popularity: number;
}

export interface TmdbTrendingMovieResponse {
  page: number;
  results: TmdbTrendingMovie[];
  total_pages: number;
  total_results: number;
}

export interface TmdbMovie {
  id: number;
  adult?: boolean;
  backdrop_path?: string;
  genre_ids?: number[];
  original_language?: string;
  original_title?: string;
  overview?: string;
  popularity?: number;
  poster_path?: string;
  release_date?: string;
  title: string;
  video?: boolean;
  vote_average?: number;
  vote_count?: number;
}

export interface TmdbMovieResponse {
  results: TmdbMovie[];
  total_pages: number;
}
