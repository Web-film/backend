import { Controller, Get, Post } from '@nestjs/common';
import { TmdbMovie } from '@src/integrations/tmdb/tmdb.types';
import { FilmsService } from '@src/modules/films/films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  getLastReleaseDate() {
    return this.filmsService.getLastReleaseDate();
  }

  @Post()
  upsertMany(movies: TmdbMovie[]) {
    return this.filmsService.upsertMany(movies);
  }
}
