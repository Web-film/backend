import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateGenreDto {
  @IsInt()
  tmdb_id: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
