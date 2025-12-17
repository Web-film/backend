import { Injectable } from '@nestjs/common';
import { TmdbFilmGenre } from '@src/integrations/tmdb/tmdb.types';
import { PrismaService } from '@src/prisma.service';

@Injectable()
export class FilmGenresService {
  constructor(private prisma: PrismaService) {}

  async insertOrUpdateMany(data: TmdbFilmGenre[]) {
    if (!data || data.length === 0) {
      return { count: 0 };
    }

    const result = await this.prisma.filmGenre.createMany({
      data,
      skipDuplicates: true,
    });

    return {
      inserted: result.count,
    };
  }
}
