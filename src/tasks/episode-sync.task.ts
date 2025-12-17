import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TasksService } from '@src/tasks/tasks.service';

@Injectable()
export class EpisodeSyncTask {
  constructor(private readonly tasksService: TasksService) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  // @Cron('0 * * * * *')
  async handleSync() {
    return this.tasksService.syncEpisodeByDay();
  }
}
