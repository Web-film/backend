import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@src/generated/prisma/client';
import { TmdbService } from '@src/integrations/tmdb/tmdb.service';
import { FilmsResponse } from '@src/integrations/tmdb/tmdb.types';
import { EpisodesService } from '@src/modules/episodes/episodes.service';
import { FilmDailyViewService } from '@src/modules/film-daily-view/film-daily-view.service';
import { FilmsService } from '@src/modules/films/films.service';
import { GenresService } from '@src/modules/genres/genres.service';
import { SeasonsService } from '@src/modules/seasons/seasons.service';
import { PrismaService } from '@src/prisma.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(GenresService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly filmsService: FilmsService,
    private readonly tmdbService: TmdbService,
    private readonly seasonsService: SeasonsService,
    private readonly episodesService: EpisodesService,
    private readonly filmDailyViewService: FilmDailyViewService,
  ) {}

  // Xử lý cron lấy toàn bộ thể loại hiện có
  async syncGenresFromTMDB() {
    const { genres } = await this.tmdbService.getMovieGenres();

    const existingGenres = await this.prisma.genre.findMany({
      select: { tmdb_id: true, name: true },
    });

    const genreMap = new Map(existingGenres.map((g) => [g.tmdb_id, g.name]));

    const creates: { tmdb_id: number; name: string }[] = [];
    const updates: { tmdb_id: number; name: string }[] = [];

    for (const genre of genres) {
      const existedName = genreMap.get(genre.id);

      if (!existedName) {
        creates.push({
          tmdb_id: genre.id,
          name: genre.name,
        });
      } else if (existedName !== genre.name) {
        updates.push({
          tmdb_id: genre.id,
          name: genre.name,
        });
      }
    }

    if (creates.length) {
      await this.prisma.genre.createMany({
        data: creates,
        skipDuplicates: true,
      });
    }

    for (const item of updates) {
      await this.prisma.genre.update({
        where: { tmdb_id: item.tmdb_id },
        data: { name: item.name },
      });
    }

    this.logger.log(
      `Genre sync done: +${creates.length} created, ${updates.length} updated`,
    );
  }

  // Xử lý cron lấy toàn bộ film bộ mới có trong ngày
  async syncMovies() {
    const lastDate = await this.filmsService.getLastReleaseDate();
    let startDate: Date;

    if (!lastDate) {
      // fecth tạm dữ liệu ban đầu khi DB trống
      startDate = new Date('2025-12-15');
    } else {
      startDate = new Date(lastDate);
      startDate.setDate(startDate.getDate() - 1);
    }

    const today = new Date();

    while (startDate <= today) {
      const dateStr = startDate.toISOString().slice(0, 10);
      console.log('Sync date:', dateStr);

      let page = 1;
      let totalPages = 1;

      do {
        const res = await this.tmdbService.getMoviesByReleaseDate(
          dateStr,
          page,
        );

        await this.filmsService.upsertMany(res.results, 'movie');

        totalPages = res.total_pages;
        page++;
      } while (page <= totalPages && page <= 500);

      startDate.setDate(startDate.getDate() + 1);
    }
  }

  // Xử lý cron lấy toàn bộ film bộ mới có trong ngày
  async syncTvs() {
    const lastDate = await this.filmsService.getLastReleaseDate();
    let startDate: Date;

    if (!lastDate) {
      // fecth tạm dữ liệu ban đầu khi DB trống
      startDate = new Date('2025-12-15');
    } else {
      startDate = new Date(lastDate);
      startDate.setDate(startDate.getDate() - 1);
    }

    const today = new Date();
    while (startDate <= today) {
      const dateStr = startDate.toISOString().slice(0, 10);
      console.log('Sync date:', dateStr);

      let page = 1;
      let totalPages = 1;

      do {
        const res = await this.tmdbService.getTVsByReleaseDate(dateStr, page);

        await this.filmsService.upsertMany(res.results, 'tv');

        totalPages = res.total_pages;
        page++;
      } while (page <= totalPages && page <= 500);

      startDate.setDate(startDate.getDate() + 1);
    }
  }

  // Xử lý cron lấy mùa phim của toàn bộ film mới có trong ngày
  async syncSeason() {
    console.log('Start cron syncSeason');

    const today = new Date();
    const filmTvs: FilmsResponse = await this.filmsService.getTv(
      undefined,
      undefined,
      today,
    );

    if (!filmTvs?.data || filmTvs.data?.length === 0) return;

    for (const film of filmTvs?.data ?? []) {
      try {
        const seasonRes = await this.tmdbService.getTvDetail(film.tmdb_id);
        const seasons = seasonRes.seasons;
        if (!seasons.length) continue;

        await this.seasonsService.upsertMany(film.id, seasonRes.seasons);
      } catch (error) {
        console.error(`Sync season failed for TV ${film.tmdb_id}`, error);
      }
    }

    console.log('Done sync seasons');
  }

  // Xử lý cron lấy từng phim của từng mùa
  async syncEpisodeByDay() {
    console.log('Start cron syncEpisodeByDay');

    const seasons = await this.seasonsService.getTodaySeasons();
    if (!seasons.length) return;

    for (const season of seasons) {
      try {
        const episodes = await this.tmdbService.getEpisodesBySeason(
          season.film.tmdb_id,
          season.season_number,
        );

        if (!episodes.length) continue;

        await this.episodesService.upsertMany(season.id, episodes);
      } catch (error) {
        console.error(`Sync episode failed for season ${season.id}`, error);
      }
    }

    console.log('Done sync episodes');
  }

  // Xử lý cron lấy diễn viên, đạo diễn
  async syncDirectorsAndCast() {
    console.log('Start cron sync directors and cast');
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setDate(startOfDay.getDate() - 1);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    // Lấy tất cả phim movie
    const movies = await this.prisma.film.findMany({
      where: {
        type: 'movie',
        created_at: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: { id: true, tmdb_id: true },
    });

    for (const movie of movies) {
      try {
        const { directors, cast } = await this.tmdbService.getMovieCredits(
          movie.tmdb_id,
        );

        await this.prisma.film.update({
          where: { id: movie.id },
          data: {
            directors: directors.length ? directors : Prisma.JsonNull,
            cast: cast.length ? cast : Prisma.JsonNull,
          },
        });
      } catch (error) {
        console.error(
          `Sync directors/cast failed for movie ${movie.tmdb_id}`,
          error,
        );
      }
    }

    console.log('Done sync directors and cast');
  }

  // Xử lý cron lấy ra trailer phim cũng là video phim đối với phim lẻ
  async syncMovieTrailers() {
    console.log('Start cron sync movie trailers');

    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setDate(startOfDay.getDate() - 1);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const movies = await this.prisma.film.findMany({
      where: {
        type: 'movie',
        created_at: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: { id: true, tmdb_id: true },
    });

    for (const movie of movies) {
      try {
        const trailerKey = await this.tmdbService.getMovieTrailer(
          movie.tmdb_id,
        );

        await this.prisma.film.update({
          where: { id: movie.id },
          data: {
            trailer_key: trailerKey ?? '',
          },
        });
      } catch (error) {
        console.error(`Sync trailer failed for movie ${movie.tmdb_id}`, error);
      }
    }

    console.log('Done sync movie trailers');
  }

  // Xử lý cron lấy ra trailer phim cũng là video phim đối với phim bộ
  async syncTvTrailers() {
    console.log('Start cron sync movie trailers');

    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setDate(startOfDay.getDate() - 1);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    const tvs = await this.prisma.film.findMany({
      where: {
        type: 'tv',
        created_at: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: { id: true, tmdb_id: true },
    });

    for (const tv of tvs) {
      try {
        const trailerKey = await this.tmdbService.getTvTrailer(tv.tmdb_id);

        await this.prisma.film.update({
          where: { id: tv.id },
          data: { trailer_key: trailerKey ?? '' },
        });
      } catch (err) {
        console.error(`Sync trailer failed for TV ${tv.tmdb_id}`, err);
      }
    }
    console.log('Done sync tv trailers');
  }

  // cron xử lý runtime với movie
  async syncMovieRuntimes() {
    console.log('Start cron syncMovieRuntimes');
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setDate(startOfDay.getDate() - 1);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const movies = await this.prisma.film.findMany({
      where: {
        type: 'movie',
        created_at: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: {
        id: true,
        tmdb_id: true,
        runtime: true,
      },
    });

    for (const movie of movies) {
      try {
        const runtime = await this.tmdbService.getRuntimeMovie(movie.tmdb_id);

        await this.prisma.film.update({
          where: { id: movie.id },
          data: {
            runtime: runtime,
          },
        });
      } catch (error) {
        console.error(`Sync runtime failed for movie ${movie.tmdb_id}`, error);
      }
    }

    console.log('Done syncMovieRuntimes');
  }

  //cron xóa view ngày tháng cũ
  async cleanOldFilmDailyViews() {
    try {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      oneMonthAgo.setHours(0, 0, 0, 0);

      await this.filmDailyViewService.deleteBefore(oneMonthAgo);

      this.logger.log(
        `Deleted FilmDailyView records older than ${oneMonthAgo.toISOString()}`,
      );
    } catch (error) {
      this.logger.error('Failed to clean FilmDailyView', error);
    }
  }
}
