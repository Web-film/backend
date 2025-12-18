import { Injectable } from '@nestjs/common';
import { TmdbSeason } from '@src/integrations/tmdb/tmdb.types';
import {
  GetSeasonsByFilmDto,
  GetSeasonsDto,
} from '@src/modules/seasons/dto/getDto.dto';
import { PrismaService } from '@src/prisma.service';

@Injectable()
export class SeasonsService {
  constructor(private prisma: PrismaService) {}

  async getSeasons(query: GetSeasonsDto) {
    const limit = query?.limit || 20;
    const page = query?.page || 1;
    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      this.prisma.season.count(),
      this.prisma.season.findMany({
        take: limit,
        skip,
        orderBy: { created_at: 'desc' },
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

  async getSeasonsByFilm(query: GetSeasonsByFilmDto) {
    const film = await this.prisma.season.findMany({
      where: { film_id: query.film_id },
    });

    return film;
  }

  // cron
  async getTodaySeasons() {
    const start = new Date();
    start.setDate(start.getDate() - 1);
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return this.prisma.season.findMany({
      where: {
        created_at: {
          gte: start,
          lte: end,
        },
      },
      include: {
        film: {
          select: {
            id: true,
            tmdb_id: true,
            type: true,
          },
        },
      },
    });
  }

  async upsertMany(tvId: number, seasons: TmdbSeason[]) {
    const data = seasons.map((s) => ({
      tmdb_season_id: s.id,
      film_id: tvId,
      season_number: s.season_number,
      name: s.name,
      overview: s.overview,
      air_date: s.air_date ? new Date(s.air_date) : null,
      episode_count: s.episode_count,
      poster_path: s.poster_path
        ? `${process.env.TMDB_IMAGE_500}${s.poster_path}`
        : '',
    }));

    await this.prisma.season.createMany({
      data,
      skipDuplicates: true,
    });
  }
}
