import { Injectable } from '@nestjs/common';
import { TmdbEpisode } from '@src/integrations/tmdb/tmdb.types';
import {
  GetEpisodeBySeasonDto,
  GetEpisodeDto,
} from '@src/modules/episodes/dto/getDto.dto';
import { PrismaService } from '@src/prisma.service';

@Injectable()
export class EpisodesService {
  constructor(private prisma: PrismaService) {}

  async getEpisode(query: GetEpisodeDto) {
    const limit = query?.limit || 20;
    const page = query?.page || 1;
    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      this.prisma.episode.count(),
      this.prisma.episode.findMany({
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

  async getEpisodeBySeason(query: GetEpisodeBySeasonDto) {
    const film = await this.prisma.episode.findMany({
      where: { season_id: query.season_id },
    });

    return film;
  }

  // cron
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
