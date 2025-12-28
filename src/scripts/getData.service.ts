import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma } from '@src/generated/prisma/client';
import { TmdbService } from '@src/integrations/tmdb/tmdb.service';
import { EpisodesService } from '@src/modules/episodes/episodes.service';
import { SeasonsService } from '@src/modules/seasons/seasons.service';
import { PrismaService } from '@src/prisma.service';
import { Gaxios } from 'gaxios';
import pLimit from 'p-limit';

@Injectable()
export class GetDataService implements OnModuleInit {
  private client: Gaxios;

  constructor(
    private prisma: PrismaService,
    private tmdbService: TmdbService,
    private seasonsService: SeasonsService,
    private episodesService: EpisodesService,
  ) {
    this.client = new Gaxios({
      baseURL: process.env.TMDB_URL,
      timeout: 10000,
    });
  }

  async onModuleInit() {
    const seasons = await this.prisma.season.findMany({
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

    const limit = pLimit(10);

    await Promise.all(
      seasons.map((season) =>
        limit(async () => {
          try {
            const episodes = await this.tmdbService.getEpisodesBySeason(
              season.film.tmdb_id,
              season.season_number,
            );

            if (!episodes?.length) return; // ✅ FIX

            await this.episodesService.upsertMany(season.id, episodes);
            console.log(`OK season=${season.id}`);
          } catch (err: any) {
            console.error(
              `[TMDB ERROR] seasonId=${season.id} tmdb_id=${season.film.tmdb_id}`,
              err?.response?.data || err?.message,
            );
          }
        }),
      ),
    );

    console.log('Đã xong');
  }
}
