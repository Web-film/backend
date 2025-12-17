import { Injectable } from '@nestjs/common';
import {
  TmdbCredits,
  TmdbEpisode,
  TmdbGenreResponse,
  TmdbMovieResponse,
  TmdbSeasonDetail,
  TmdbSeasonRes,
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

  // lấy phim bộ theo ngày phát hành
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

  // lấy phim lẻ theo ngày phát hành
  async getTVsByReleaseDate(
    date: string,
    page = 1,
  ): Promise<TmdbMovieResponse> {
    const res = await this.client.request<TmdbMovieResponse>({
      url: 'discover/tv',
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

  // lấy mùa của các phim lẻ theo ngày phát hành
  async getTvDetail(tvId: number): Promise<TmdbSeasonRes> {
    const res = await this.client.request<TmdbSeasonRes>({
      url: `tv/${tvId}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
    });

    return res.data;
  }

  // lấy ra tất cả các phim của mùa theo ngày
  async getEpisodesBySeason(
    tvId: number,
    seasonNumber: number,
  ): Promise<TmdbEpisode[]> {
    const res = await this.client.request<TmdbSeasonDetail>({
      url: `tv/${tvId}/season/${seasonNumber}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
    });
    return res.data.episodes ?? [];
  }

  // lấy ra đạo diễn và diễn viên
  async getMovieCredits(
    tmdbId: number,
  ): Promise<{ directors: any[]; cast: any[] }> {
    const res = await this.client.request<TmdbCredits>({
      url: `movie/${tmdbId}/credits`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
    });

    const directors = res.data.crew.filter((c) => c.job === 'Director');
    const cast = res.data.cast.sort((a, b) => a.order - b.order).slice(0, 10);

    return { directors, cast };
  }
}
