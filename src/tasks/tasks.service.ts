import { Injectable, Logger } from '@nestjs/common';
import { TmdbService } from '@src/integrations/tmdb/tmdb.service';
import { FilmsService } from '@src/modules/films/films.service';
import { GenresService } from '@src/modules/genres/genres.service';
import { PrismaService } from '@src/prisma.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(GenresService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly filmsService: FilmsService,
    private readonly tmdbService: TmdbService,
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

  // Xử lý cron lấy toàn bộ film mới có trong ngày
  async syncMovies() {
    const lastDate = await this.filmsService.getLastReleaseDate();
    let startDate: Date;

    if (!lastDate) {
      // fecth tạm dữ liệu ban đầu khi DB trống
      startDate = new Date('2025-12-15');
    } else {
      startDate = new Date(lastDate);
      startDate.setDate(startDate.getDate() + 1);
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

        await this.filmsService.upsertMany(res.results);

        totalPages = res.total_pages;
        page++;
      } while (page <= totalPages && page <= 500);

      startDate.setDate(startDate.getDate() + 1);
    }
  }
}
