import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TasksService } from '@src/tasks/tasks.service';

@Injectable()
export class SeasonSyncTask {
  constructor(private readonly tasksService: TasksService) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  // @Cron('0 * * * * *')
  async handleSync() {
    return this.tasksService.syncSeason();
  }
}
