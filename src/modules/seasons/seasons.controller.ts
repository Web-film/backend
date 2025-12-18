import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import {
  GetSeasonsByFilmDto,
  GetSeasonsDto,
} from '@src/modules/seasons/dto/getDto.dto';
import { SeasonsService } from '@src/modules/seasons/seasons.service';

@Controller('seasons')
export class SeasonsController {
  constructor(private seasonsService: SeasonsService) {}

  @Get('/')
  async getSeasons(
    @Query(new ValidationPipe({ transform: true }))
    query: GetSeasonsDto,
  ) {
    try {
      const data = await this.seasonsService.getSeasons(query);

      return {
        status: 200,
        message: 'Lấy danh sách phim thành công',
        data,
      };
    } catch (error) {
      return {
        status: 404,
        message: 'Lấy danh sách phim thất bại',
        error: (error as Error).message,
      };
    }
  }

  @Get('/getSeasonsByFilm')
  async getSeasonsByFilm(
    @Query(new ValidationPipe({ transform: true }))
    query: GetSeasonsByFilmDto,
  ) {
    try {
      const data = await this.seasonsService.getSeasonsByFilm(query);

      return {
        status: 200,
        message: 'Lấy danh sách phim thành công',
        data,
      };
    } catch (error) {
      return {
        status: 404,
        message: 'Lấy danh sách phim thất bại',
        error: (error as Error).message,
      };
    }
  }

  @Get('/getTodaySeasons')
  getTodaySeasons() {
    this.seasonsService.getTodaySeasons();
  }
}
