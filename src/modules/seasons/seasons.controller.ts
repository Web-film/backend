import { Controller, Get, Post } from '@nestjs/common';
import { TmdbSeason } from '@src/integrations/tmdb/tmdb.types';
import { SeasonsService } from '@src/modules/seasons/seasons.service';

@Controller('seasons')
export class SeasonsController {
  constructor(private seasonsService: SeasonsService) {}

  @Get()
  getTodaySeasons() {
    this.seasonsService.getTodaySeasons();
  }

  @Post()
  upsertMany(tvId: number, seasons: TmdbSeason[]) {
    this.seasonsService.upsertMany(tvId, seasons);
  }
}
