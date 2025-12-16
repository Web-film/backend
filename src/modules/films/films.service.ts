import { Injectable } from '@nestjs/common';
import { TmdbMovie } from '@src/integrations/tmdb/tmdb.types';
import { PrismaService } from '@src/prisma.service';

@Injectable()
export class FilmsService {
  constructor(private prisma: PrismaService) {}

  async getLastReleaseDate(): Promise<Date | null> {
    const film = await this.prisma.film.findFirst({
      where: {
        release_date: { not: null },
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

  async upsertMany(movies: TmdbMovie[]) {
    for (const movie of movies) {
      // bỏ phim không có title
      if (!movie.title) continue;

      await this.prisma.film.upsert({
        where: {
          tmdb_id: movie.id,
        },
        update: {
          title: movie.title,
          original_title: movie.original_title,
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
          rating: movie.vote_average,
          vote_count: movie.vote_count,
          popularity: movie.popularity,
        },
        create: {
          tmdb_id: movie.id,
          title: movie.title,
          original_title: movie.original_title || '',
          slug: movie.title,
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
          type: 'movie',
          status: 'completed',
          rating: movie.vote_average,
          vote_count: movie.vote_count,
          popularity: movie.popularity,
        },
      });
    }
  }
}
