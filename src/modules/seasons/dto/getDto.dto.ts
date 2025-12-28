import { IsInt, IsDefined, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetSeasonsByFilmDto {
  @IsDefined({ message: 'id film là bắt buộc' })
  @Type(() => Number)
  @IsInt({ message: 'id film phải là số nguyên' })
  film_id: number;
}

export class GetSeasonsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit phải là số nguyên' })
  @Min(1, { message: 'limit phải >= 1' })
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page phải là số nguyên' })
  @Min(1, { message: 'page phải >= 1' })
  page?: number;
}

export class CheckEpisodeDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Id mùa phim không hợp lệ' })
  @Min(1, { message: 'Id mùa phim phải >= 1' })
  season_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Id phim không hợp lệ' })
  @Min(1, { message: 'Id phim phải >= 1' })
  episode_id?: number;
}
