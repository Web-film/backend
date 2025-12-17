import { Injectable } from '@nestjs/common';
import { TmdbEpisode } from '@src/integrations/tmdb/tmdb.types';
import { PrismaService } from '@src/prisma.service';

@Injectable()
export class EpisodesService {
  constructor(private prisma: PrismaService) {}

  async upsertMany(seasonId: number, episodes: TmdbEpisode[]) {
    for (const ep of episodes) {
      await this.prisma.episode.upsert({
        where: {
          tmdb_episode_id: ep.id,
        },
        update: {
          name: ep.name,
          overview: ep.overview,
          runtime: ep.runtime,
          air_date: ep.air_date ? new Date(ep.air_date) : null,
          still_path: ep.still_path
            ? `${process.env.TMDB_IMAGE_500}${ep.still_path}`
            : '',
          episode_number: ep.episode_number,
        },
        create: {
          tmdb_episode_id: ep.id,
          season_id: seasonId,
          episode_number: ep.episode_number,
          name: ep.name,
          overview: ep.overview,
          runtime: ep.runtime,
          air_date: ep.air_date ? new Date(ep.air_date) : null,
          still_path: ep.still_path
            ? `${process.env.TMDB_IMAGE_500}${ep.still_path}`
            : '',
        },
      });
    }
  }
}
