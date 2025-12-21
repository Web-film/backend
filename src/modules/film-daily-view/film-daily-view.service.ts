import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma.service';

@Injectable()
export class FilmDailyViewService {
  constructor(private prisma: PrismaService) {}

  //cron
  async deleteBefore(date: Date) {
    return await this.prisma.filmDailyView.deleteMany({
      where: {
        view_date: {
          lt: date,
        },
      },
    });
  }
}
