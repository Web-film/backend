import { Module } from '@nestjs/common';
import { FilmGenresController } from './film-genres.controller';
import { FilmGenresService } from './film-genres.service';

@Module({
  controllers: [FilmGenresController],
  providers: [FilmGenresService],
})
export class FilmGenresModule {}
