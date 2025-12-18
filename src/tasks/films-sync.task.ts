import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TasksService } from '@src/tasks/tasks.service';

@Injectable()
export class FilmsSyncTask {
  constructor(private readonly tasksService: TasksService) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  // @Cron(CronExpression.EVERY_MINUTE)
  async handleSyncMovie() {
    return this.tasksService.syncMovies();
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  // @Cron(CronExpression.EVERY_MINUTE)
  async handleSyncTv() {
    return this.tasksService.syncTvs();
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  // @Cron(CronExpression.EVERY_MINUTE)
  async syncDirectorsAndCast() {
    return this.tasksService.syncDirectorsAndCast();
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  // @Cron(CronExpression.EVERY_MINUTE)
  async syncMovieTrailers() {
    return this.tasksService.syncMovieTrailers();
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  // @Cron(CronExpression.EVERY_MINUTE)
  async syncTvTrailers() {
    return this.tasksService.syncTvTrailers();
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  // @Cron(CronExpression.EVERY_MINUTE)
  async syncMovieRuntimes() {
    return this.tasksService.syncMovieRuntimes();
  }
}
