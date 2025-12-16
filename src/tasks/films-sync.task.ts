import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TasksService } from '@src/tasks/tasks.service';

@Injectable()
export class FilmsSyncTask {
  constructor(private readonly tasksService: TasksService) {}

  // @Cron(CronExpression.EVERY_DAY_AT_11PM)
  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleSync() {
    return this.tasksService.syncMovies();
  }
}
