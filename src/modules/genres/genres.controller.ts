import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateGenreDto } from '@src/modules/genres/dto/create-genres.dto';
import { GenresService } from '@src/modules/genres/genres.service';

@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Get()
  getGenres() {
    return this.genresService.getGenres();
  }
  // @Post()
  // createGenres(@Body() body: CreateGenreDto) {
  //   return this.genresService.createGenres(body);
  // }
}
