import {
  Controller,
  Get,
  Param,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import {
  GetEpisodeBySeasonDto,
  GetEpisodeDto,
} from '@src/modules/episodes/dto/getDto.dto';
import { EpisodesService } from '@src/modules/episodes/episodes.service';

@Controller('episodes')
export class EpisodesController {
  constructor(private episodesService: EpisodesService) {}

  @Get('/')
  async getEpisode(
    @Query(new ValidationPipe({ transform: true }))
    query: GetEpisodeDto,
  ) {
    try {
      const data = await this.episodesService.getEpisode(query);

      return {
        status: 200,
        message: 'Lấy danh sách các tập phim thành công',
        data,
      };
    } catch (error) {
      return {
        status: 404,
        message: 'Lấy danh sách các tập phim thất bại',
        error: (error as Error).message,
      };
    }
  }

  @Get('/getEpisodeBySeason')
  async getEpisodeBySeason(
    @Query(new ValidationPipe({ transform: true }))
    query: GetEpisodeBySeasonDto,
  ) {
    try {
      const data = await this.episodesService.getEpisodeBySeason(query);

      return {
        status: 200,
        message: 'Lấy danh sách các tập phim của mùa thành công',
        data,
      };
    } catch (error) {
      return {
        status: 404,
        message: 'Lấy danh sách các tập phim của mùa thất bại',
        error: (error as Error).message,
      };
    }
  }

  @Put('/increaseView/:id')
  async increaseViewEpisodes(@Param('id') id: string) {
    try {
      const data = await this.episodesService.increaseViewEpisodes(id);

      return {
        status: 200,
        message: 'Tăng view tập phim của mùa thành công',
        data,
      };
    } catch (error) {
      return {
        status: 404,
        message: 'Tăng view tập phim của mùa thất bại',
        error: (error as Error).message,
      };
    }
  }
}
