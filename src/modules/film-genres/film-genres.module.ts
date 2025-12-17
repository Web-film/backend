import { Module } from '@nestjs/common';
import { FilmGenresController } from './film-genres.controller';
import { FilmGenresService } from './film-genres.service';
import { PrismaService } from '@src/prisma.service';

@Module({
  controllers: [FilmGenresController],
  providers: [FilmGenresService, PrismaService],
  exports: [FilmGenresService],
})
export class FilmGenresModule {}
