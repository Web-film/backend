import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DirectorModule } from 'src/modules/director/director.module';
import { EpisodeViewsModule } from 'src/modules/episode-views/episode-views.module';
import { EpisodesModule } from 'src/modules/episodes/episodes.module';
import { FilmCastModule } from 'src/modules/film-cast/film-cast.module';
import { FilmDirectorModule } from 'src/modules/film-director/film-director.module';
import { FilmGenresModule } from 'src/modules/film-genres/film-genres.module';
import { FilmsModule } from 'src/modules/films/films.module';
import { GenresModule } from 'src/modules/genres/genres.module';
import { PersonModule } from 'src/modules/person/person.module';
import { SeasonsModule } from 'src/modules/seasons/seasons.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DirectorModule,
    EpisodeViewsModule,
    EpisodesModule,
    FilmCastModule,
    FilmDirectorModule,
    FilmGenresModule,
    FilmsModule,
    GenresModule,
    PersonModule,
    SeasonsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
