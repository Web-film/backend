import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TasksService } from '@src/tasks/tasks.service';

@Injectable()
export class FilmsSyncTask {
  constructor(private readonly tasksService: TasksService) {}

  @Cron('5 0 * * *')
  // @Cron(CronExpression.EVERY_10_SECONDS)
  async handleSyncMovie() {
    return this.tasksService.syncMovies();
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  // @Cron(CronExpression.EVERY_10_SECONDS)
  async handleSyncTv() {
    return this.tasksService.syncTvs();
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  // @Cron(CronExpression.EVERY_10_SECONDS)
  async syncDirectorsAndCast() {
    return this.tasksService.syncDirectorsAndCast();
  }
}
