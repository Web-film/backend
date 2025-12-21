import { Module } from '@nestjs/common';
import { TmdbModule } from '@src/integrations/tmdb/tmdb.module';
import { EpisodesModule } from '@src/modules/episodes/episodes.module';
import { FilmDailyViewModule } from '@src/modules/film-daily-view/film-daily-view.module';
import { FilmGenresModule } from '@src/modules/film-genres/film-genres.module';
import { FilmsModule } from '@src/modules/films/films.module';
import { SeasonsModule } from '@src/modules/seasons/seasons.module';
import { PrismaService } from '@src/prisma.service';
import { EpisodeSyncTask } from '@src/tasks/episode-sync.task';
import { FilmDailyViewSyncTask } from '@src/tasks/film-daily-view-sync.task';
import { FilmsSyncTask } from '@src/tasks/films-sync.task';
import { GenreSyncTask } from '@src/tasks/genre-sync.task';
import { SeasonSyncTask } from '@src/tasks/season-sync.task';
import { TasksService } from '@src/tasks/tasks.service';

@Module({
  imports: [
    TmdbModule,
    FilmGenresModule,
    FilmsModule,
    SeasonsModule,
    EpisodesModule,
    FilmDailyViewModule,
  ],
  providers: [
    FilmsSyncTask,
    GenreSyncTask,
    TasksService,
    SeasonSyncTask,
    EpisodeSyncTask,
    FilmDailyViewSyncTask,
    PrismaService,
  ],
})
export class TasksModule {}
