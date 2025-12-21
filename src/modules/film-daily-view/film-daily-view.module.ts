import { Module } from '@nestjs/common';
import { FilmDailyViewController } from './film-daily-view.controller';
import { FilmDailyViewService } from './film-daily-view.service';
import { PrismaService } from '@src/prisma.service';

@Module({
  controllers: [FilmDailyViewController],
  providers: [FilmDailyViewService, PrismaService],
  exports: [FilmDailyViewService],
})
export class FilmDailyViewModule {}
