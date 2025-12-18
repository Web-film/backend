import { FilmType } from '@src/generated/prisma/enums';

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
  name?: string;
  original_name?: string;
}

export interface TmdbTvDetail {
  id: number;
  name: string;
  original_name: string;
  overview: string | null;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string | null;
  number_of_seasons: number;
  number_of_episodes: number;
  genres: { id: number; name: string }[];
  seasons: {
    id: number;
    season_number: number;
    name: string;
    episode_count: number;
    air_date: string | null;
    poster_path: string | null;
  }[];
}

export interface TmdbSeason {
  id: number;
  season_number: number;
  name: string;
  overview: string | null;
  air_date: string | null;
  episode_count: number;
  poster_path: string | null;
}

export interface TmdbSeasonRes {
  seasons: TmdbSeason[];
}

export interface Pagination {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}
export interface TmdbMovieResponse {
  results: TmdbMovie[];
  total_pages: number;
}
export interface FilmTypeData {
  id: number;
  tmdb_id: number;
  title: string;
  original_title: string;
  slug: string;
  overview: string | null;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: Date | null;
  type: FilmType;
  status: string;
  rating: number | null;
  vote_count: number | null;
  popularity: number | null;
  runtime: number | null;
  trailer_key: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  directors: any;
  cast: any;
}
export interface FilmsResponse {
  data: FilmTypeData[];
  total?: number | undefined;
  pagination?: Pagination | undefined;
}

export interface TmdbFilmGenre {
  genre_id: number;
  film_id: number;
}

export interface TmdbFilmGenreResponse {
  data: TmdbFilmGenre[];
}

export interface TmdbEpisode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  runtime: number | null;
  air_date: string | null;
  still_path: string | null;
}

export interface TmdbSeasonDetail {
  episodes: TmdbEpisode[];
}

export interface TmdbCredits {
  id: number;
  cast: {
    cast_id: number;
    character: string;
    name: string;
    profile_path: string | null;
    order: number;
  }[];
  crew: {
    id: number;
    job: string;
    name: string;
    department: string;
    profile_path: string | null;
  }[];
}

export interface TmdbVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface TmdbVideoResponse {
  id: number;
  results: TmdbVideo[];
}

export interface TmdbMovieRuntime {
  runtime: number | null;
}
