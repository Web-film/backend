import { Module } from '@nestjs/common';
import { TmdbModule } from '@src/integrations/tmdb/tmdb.module';
import { FilmsService } from '@src/modules/films/films.service';
import { PrismaService } from '@src/prisma.service';
import { FilmsSyncTask } from '@src/tasks/films-sync.task';
import { GenreSyncTask } from '@src/tasks/genre-sync.task';
import { TasksService } from '@src/tasks/tasks.service';

@Module({
  imports: [TmdbModule],
  providers: [
    FilmsSyncTask,
    GenreSyncTask,
    TasksService,
    PrismaService,
    FilmsService,
  ],
})
export class TasksModule {}
