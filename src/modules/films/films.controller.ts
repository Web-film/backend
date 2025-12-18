import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import {
  GetFilmDto,
  GetFilmNewDto,
  GetFilmPopularDto,
} from '@src/modules/films/dto/getDto.dto';
import { FilmsService } from '@src/modules/films/films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get('/')
  async getFilm(
    @Query(new ValidationPipe({ transform: true }))
    query: GetFilmDto,
  ) {
    try {
      const data = await this.filmsService.getFilm(query);

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

  @Get(':id')
  async getFilmDetail(@Param('id', ParseIntPipe) id: number) {
    try {
      const film = await this.filmsService.getFilmDetail(id);

      return {
        status: 200,
        message: 'Lấy chi tiết phim thành công',
        data: film,
      };
    } catch (error) {
      return {
        status: 404,
        message: 'Lấy chi tiết phim thất bại',
        error: (error as Error).message,
      };
    }
  }

  @Get('/new')
  async getFilmNew(
    @Query(new ValidationPipe({ transform: true }))
    query: GetFilmNewDto,
  ) {
    try {
      const data = await this.filmsService.getFilmNew(query);

      return {
        status: 200,
        message: 'Lấy danh sách phim mới thành công',
        data,
      };
    } catch (error) {
      return {
        status: 404,
        message: 'Lấy danh sách phim mới thất bại',
        error: (error as Error).message,
      };
    }
  }

  @Get('/popular')
  async getFilmPopular(
    @Query(new ValidationPipe({ transform: true }))
    query: GetFilmPopularDto,
  ) {
    try {
      const data = await this.filmsService.getFilmPopular(query);

      return {
        status: 200,
        message: 'Lấy danh sách phim phổ biến thành công',
        data,
      };
    } catch (error) {
      return {
        status: 404,
        message: 'Lấy danh sách phim phổ biến thất bại',
        error: (error as Error).message,
      };
    }
  }

  @Get('/getLast')
  getLastReleaseDate() {
    return this.filmsService.getLastReleaseDate();
  }
}
