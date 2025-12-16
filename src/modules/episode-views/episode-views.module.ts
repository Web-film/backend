import { Module } from '@nestjs/common';
import { EpisodeViewsController } from './episode-views.controller';
import { EpisodeViewsService } from './episode-views.service';

@Module({
  controllers: [EpisodeViewsController],
  providers: [EpisodeViewsService],
})
export class EpisodeViewsModule {}
