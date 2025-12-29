import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@src/generated/prisma/client';
import { FilmType } from '@src/generated/prisma/enums';
import { TmdbMovie } from '@src/integrations/tmdb/tmdb.types';
import { FilmGenresService } from '@src/modules/film-genres/film-genres.service';
import {
  GetFilmDto,
  GetFilmNewDto,
  GetFilmNewUpdateDto,
  GetFilmPopularDto,
} from '@src/modules/films/dto/getDto.dto';
import { GenresService } from '@src/modules/genres/genres.service';
import { PrismaService } from '@src/prisma.service';

@Injectable()
export class FilmsService {
  constructor(
    private readonly filmGenresService: FilmGenresService,
    private readonly genresService: GenresService,
    private prisma: PrismaService,
  ) {}

  async getFilm(query: GetFilmDto) {
    const limit = query?.limit || 20;
    const page = query?.page || 1;
    const skip = (page - 1) * limit;

    const where: Prisma.FilmWhereInput = {
      is_active: true,
      ...(query.type ? { type: query.type } : {}),
      ...(query.genreId
        ? {
            genres: {
              some: {
                genre_id: query.genreId,
              },
            },
          }
        : {}),
      ...(query.search
        ? {
            OR: [
              {
                title: {
                  contains: query.search,
                },
              },
              {
                original_title: {
                  contains: query.search,
                },
              },
            ],
          }
        : {}),
    };

    const [total, items] = await Promise.all([
      this.prisma.film.count({ where }),
      this.prisma.film.findMany({
        where,
        take: limit,
        skip,
        orderBy: { created_at: 'desc' },
        include: {
          genres: { include: { genre: true } },
        },
      }),
    ]);
    const hasNextPage = page * limit < total;

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage,
      },
    };
  }

  async getFilmNew(query: GetFilmNewDto) {
    const limit = query?.limit || 20;
    const page = query?.page || 1;
    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      this.prisma.film.count(),
      this.prisma.film.findMany({
        take: limit,
        skip: skip,
        orderBy: { release_date: 'desc' },
        include: {
          genres: { include: { genre: true } },
        },
      }),
    ]);
    const hasNextPage = page * limit < total;
    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage,
      },
    };
  }

  async getFilmNewUpdate(query: GetFilmNewUpdateDto) {
    const limit = query?.limit || 20;
    const page = query?.page || 1;
    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      this.prisma.film.count(),
      this.prisma.film.findMany({
        take: limit,
        skip: skip,
        orderBy: { updated_at: 'desc' },
      }),
    ]);
    const hasNextPage = page * limit < total;
    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage,
      },
    };
  }

  async getFilmPopular(query: GetFilmPopularDto) {
    const limit = query.limit || 20;
    const page = query.page || 1;
    const offset = (page - 1) * limit;

    //Lấy top films theo views trong 7 ngày
    let popularFilms = await this.prisma.$queryRaw<any[]>`
    SELECT f.id,
           f.tmdb_id,
           f.title,
           f.original_title,
           f.slug,
           CAST(f.overview AS CHAR) AS overview,
           f.poster_path,
           f.backdrop_path,
           f.release_date,
           f.type,
           CAST(f.directors AS CHAR) AS directors,
           CAST(f.cast AS CHAR) AS cast,
           COALESCE(fdv_total.total_views, 0) AS total_views
    FROM film f
    LEFT JOIN (
      SELECT film_id, SUM(views) AS total_views
      FROM filmdailyview
      WHERE view_date >= NOW() - INTERVAL 7 DAY
      GROUP BY film_id
    ) AS fdv_total
    ON fdv_total.film_id = f.id
    ORDER BY total_views DESC
    LIMIT ${limit} OFFSET ${offset};
  `;

    // Nếu thiếu số lượng limit, bổ sung film mới
    const remaining = limit - popularFilms.length;
    if (remaining > 0) {
      const popularIds = popularFilms.map((f) => f.id);
      const additionalFilms = await this.prisma.$queryRaw<any[]>`
      SELECT f.id,
             f.tmdb_id,
             f.title,
             f.original_title,
             f.slug,
             CAST(f.overview AS CHAR) AS overview,
             f.poster_path,
             f.backdrop_path,
             f.release_date,
             f.type,
             CAST(f.directors AS CHAR) AS directors,
             CAST(f.cast AS CHAR) AS cast,
             0 AS total_views
      FROM film f
      ${
        popularIds.length > 0
          ? `WHERE NOT EXISTS (
          SELECT 1
          FROM film f2
          WHERE f2.id = ANY (${popularIds})
          AND f2.id = f.id
        )`
          : ''
      }
      ORDER BY f.created_at DESC
      LIMIT ${remaining};
    `;
      popularFilms = [...popularFilms, ...additionalFilms];
    }

    const totalCountResult = await this.prisma.$queryRaw<any[]>`
    SELECT COUNT(*) AS count
    FROM film;
  `;
    const totalCount = Number(totalCountResult[0]?.count || 0);

    return {
      items: popularFilms,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page * limit < totalCount,
      },
    };
  }

  async getFilmDetail(id: number) {
    const film = await this.prisma.film.findUnique({
      where: { id },
      include: {
        genres: { include: { genre: true } },
        seasons: {
          include: { episodes: true },
        },
      },
    });

    return film;
  }

  async increaseViewFilm(id: string) {
    const filmId = Number(id);
    if (Number.isNaN(filmId)) {
      throw new BadRequestException('id film không hợp lệ');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await this.prisma.$transaction(async (tx) => {
      const filmExists = await tx.film.findFirst({
        where: {
          id: filmId,
          type: FilmType.movie,
        },
        select: { id: true },
      });

      if (!filmExists) {
        throw new BadRequestException('id film không hợp lệ');
      }

      const film = await tx.film.update({
        where: { id: filmId },
        data: {
          views: { increment: 1 },
        },
      });

      await tx.filmDailyView.upsert({
        where: {
          film_id_view_date: {
            film_id: filmId,
            view_date: today,
          },
        },
        update: {
          views: { increment: 1 },
        },
        create: {
          film_id: filmId,
          view_date: today,
          views: 1,
        },
      });

      return film;
    });
  }

  // Phần cron
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
