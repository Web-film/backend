import { Module } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { PrismaService } from '@src/prisma.service';

@Module({
  controllers: [FilmsController],
  providers: [FilmsService, PrismaService],
})
export class FilmsModule {}
