import { Injectable } from '@nestjs/common';
import { Prisma } from '@src/generated/prisma/client';
import { FilmType } from '@src/generated/prisma/enums';
import { TmdbMovie } from '@src/integrations/tmdb/tmdb.types';
import { FilmGenresService } from '@src/modules/film-genres/film-genres.service';
import { GenresService } from '@src/modules/genres/genres.service';
import { PrismaService } from '@src/prisma.service';

@Injectable()
export class FilmsService {
  constructor(
    private readonly filmGenresService: FilmGenresService,
    private readonly genresService: GenresService,
    private prisma: PrismaService,
  ) {}

  async getLastReleaseDate(type?: FilmType): Promise<Date | null> {
    const film = await this.prisma.film.findFirst({
      where: {
        release_date: { not: null },
        ...(type && { type }),
      },
      orderBy: {
        release_date: 'desc',
      },
      select: {
        release_date: true,
      },
    });

    return film?.release_date ?? null;
  }

  async upsertMany(movies: TmdbMovie[], type: FilmType) {
    const filmGenreData: { film_id: number; genre_id: number }[] = [];

    const allGenreIds = Array.from(
      new Set(movies.flatMap((m) => m.genre_ids ?? [])),
    );

    const genresInDb = await this.genresService.findManyByTmdbIds(allGenreIds);

    const genreMap = new Map<number, number>();
    for (const genre of genresInDb) {
      genreMap.set(genre.tmdb_id, genre.id);
    }

    for (const movie of movies) {
      const title = movie.title || movie.name || '';
      const original_title =
        movie?.original_title || movie?.original_name || '';
      if (!title) continue;

      const film = await this.prisma.film.upsert({
        where: { tmdb_id: movie.id },
        update: {
          title: title,
          original_title: original_title,
          overview: movie.overview,
          poster_path: movie.poster_path
            ? `${process.env.TMDB_IMAGE_500}${movie.poster_path}`
            : '',
          backdrop_path: movie.backdrop_path
            ? `${process.env.TMDB_IMAGE}${movie.backdrop_path}`
            : '',
          release_date: movie.release_date
            ? new Date(movie.release_date)
            : null,
          rating: movie?.vote_average,
          vote_count: movie?.vote_count,
          popularity: movie?.popularity,
        },
        create: {
          tmdb_id: movie.id,
          title: title,
          original_title: original_title,
          slug: title,
          overview: movie.overview,
          poster_path: movie.poster_path
            ? `${process.env.TMDB_IMAGE_500}${movie.poster_path}`
            : '',
          backdrop_path: movie.backdrop_path
            ? `${process.env.TMDB_IMAGE}${movie.backdrop_path}`
            : '',
          release_date: movie.release_date
            ? new Date(movie.release_date)
            : null,
          type,
          status: 'completed',
          rating: movie?.vote_average,
          vote_count: movie?.vote_count,
          popularity: movie?.popularity,
        },
      });

      for (const tmdbGenreId of movie.genre_ids ?? []) {
        const genreId = genreMap.get(tmdbGenreId);
        if (!genreId) continue;

        filmGenreData.push({
          film_id: film.id,
          genre_id: genreId,
        });
      }
    }

    if (filmGenreData.length) {
      await this.filmGenresService.insertOrUpdateMany(filmGenreData);
    }
  }

  async getTv(page?: number, limit?: number, date?: Date) {
    const where: Prisma.FilmWhereInput = {
      type: FilmType.tv,
    };

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setDate(startOfDay.getDate() - 1);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      where.created_at = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    if (!limit) {
      const data = await this.prisma.film.findMany({
        where,
        orderBy: {
          release_date: 'desc',
        },
      });

      return {
        data,
        total: data.length,
        pagination: undefined,
      };
    }

    const currentPage = page && page > 0 ? page : 1;
    const take = limit;
    const skip = (currentPage - 1) * take;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.film.findMany({
        where,
        skip,
        take,
        orderBy: {
          release_date: 'desc',
        },
      }),
      this.prisma.film.count({ where }),
    ]);

    return {
      data,
      total: undefined,
      pagination: {
        page: currentPage,
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    };
  }
}
