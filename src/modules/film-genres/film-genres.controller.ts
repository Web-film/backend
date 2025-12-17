import { Controller, Post } from '@nestjs/common';
import { TmdbFilmGenre } from '@src/integrations/tmdb/tmdb.types';
import { FilmGenresService } from '@src/modules/film-genres/film-genres.service';

@Controller('film-genres')
export class FilmGenresController {
  constructor(private filmGender: FilmGenresService) {}

  @Post()
  async insertOrUpdateMany(data: TmdbFilmGenre[]) {
    const result = await this.filmGender.insertOrUpdateMany(data);

    return {
      success: true,
      message: 'Insert film genres successfully',
      data: result,
    };
  }
}
