import { Body, Controller, Get } from '@nestjs/common';
import { GenresService } from '@src/modules/genres/genres.service';

@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Get()
  getGenres() {
    return this.genresService.getGenres();
  }

  @Get('/many')
  findManyByTmdbIds(genreIds: number[]) {
    return this.genresService.findManyByTmdbIds(genreIds);
  }
  // @Post()
  // createGenres(@Body() body: CreateGenreDto) {
  //   return this.genresService.createGenres(body);
  // }
}
