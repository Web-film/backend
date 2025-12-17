import { Module } from '@nestjs/common';
import { EpisodesController } from './episodes.controller';
import { EpisodesService } from './episodes.service';
import { PrismaService } from '@src/prisma.service';

@Module({
  controllers: [EpisodesController],
  providers: [EpisodesService, PrismaService],
  exports: [EpisodesService],
})
export class EpisodesModule {}
