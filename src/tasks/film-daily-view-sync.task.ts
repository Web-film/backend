import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TasksService } from '@src/tasks/tasks.service';

@Injectable()
export class FilmDailyViewSyncTask {
  constructor(private readonly tasksService: TasksService) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  //   @Cron(CronExpression.EVERY_10_SECONDS)
  async handleSync() {
    return this.tasksService.cleanOldFilmDailyViews();
  }
}
