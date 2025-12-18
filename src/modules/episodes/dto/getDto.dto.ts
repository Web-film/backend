import { IsInt, IsDefined, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetEpisodeBySeasonDto {
  @IsDefined({ message: 'id mùa là bắt buộc' })
  @Type(() => Number)
  @IsInt({ message: 'id mùa phải là số nguyên' })
  season_id: number;
}

export class GetEpisodeDto {
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
