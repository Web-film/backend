import { Controller, Get, Post, Query } from '@nestjs/common';
import { FilmType } from '@src/generated/prisma/enums';
import { TmdbMovie } from '@src/integrations/tmdb/tmdb.types';
import { FilmsService } from '@src/modules/films/films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  getLastReleaseDate() {
    return this.filmsService.getLastReleaseDate();
  }

  @Get('/tv')
  async getTv(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('page') date?: Date,
  ) {
    const result = await this.filmsService.getTv(
      page ? Number(page) : undefined,
      limit ? Number(limit) : undefined,
      date ? date : undefined,
    );

    return {
      message: 'Get TV films successfully',
      ...result,
    };
  }

  @Post()
  upsertMany(movies: TmdbMovie[], type: FilmType) {
    return this.filmsService.upsertMany(movies, type);
  }
}
