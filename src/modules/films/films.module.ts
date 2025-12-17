import { Module } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { PrismaService } from '@src/prisma.service';
import { FilmGenresModule } from '@src/modules/film-genres/film-genres.module';
import { GenresModule } from '@src/modules/genres/genres.module';

@Module({
  imports: [FilmGenresModule, GenresModule],
  controllers: [FilmsController],
  providers: [FilmsService, PrismaService],
  exports: [FilmsService],
})
export class FilmsModule {}
