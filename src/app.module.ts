import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { EpisodesModule } from '@src/modules/episodes/episodes.module';
import { FilmGenresModule } from '@src/modules/film-genres/film-genres.module';
import { FilmsModule } from '@src/modules/films/films.module';
import { GenresModule } from '@src/modules/genres/genres.module';
import { SeasonsModule } from '@src/modules/seasons/seasons.module';
import { TasksModule } from '@src/tasks/tasks.module';
import { PrismaService } from '@src/prisma.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    TasksModule,
    EpisodesModule,
    FilmGenresModule,
    FilmsModule,
    GenresModule,
    SeasonsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
