import { Injectable } from '@nestjs/common';
import {
  TmdbGenreResponse,
  TmdbMovieResponse,
  TmdbTrendingMovieResponse,
} from '@src/integrations/tmdb/tmdb.types';
import { Gaxios } from 'gaxios';

@Injectable()
export class TmdbService {
  private client: Gaxios;

  constructor() {
    this.client = new Gaxios({
      baseURL: process.env.TMDB_URL,
      timeout: 10000,
    });
  }

  async getMovieGenres(): Promise<TmdbGenreResponse> {
    const res = await this.client.request<TmdbGenreResponse>({
      url: 'genre/movie/list',
      method: 'GET',
      params: {
        api_key: process.env.TMDB_API_KEY,
      },
    });

    return res.data;
  }

  async getTrendingMovies(): Promise<TmdbTrendingMovieResponse> {
    const res = await this.client.request<TmdbTrendingMovieResponse>({
      url: 'trending/movie/day',
      method: 'GET',
      params: {
        api_key: process.env.TMDB_API_KEY,
      },
    });

    return res.data;
  }

  // lấy theo ngày phát hành
  async getMoviesByReleaseDate(
    date: string,
    page = 1,
  ): Promise<TmdbMovieResponse> {
    const res = await this.client.request<TmdbMovieResponse>({
      url: 'discover/movie',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
      params: {
        'primary_release_date.gte': date,
        'primary_release_date.lte': date,
        page,
        sort_by: 'popularity.desc',
      },
    });

    return res.data;
  }
}
