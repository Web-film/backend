import { Injectable } from '@nestjs/common';
import { Genre } from '@src/generated/prisma/client';
import { PrismaService } from '@src/prisma.service';
// import { CreateGenreDto } from '@src/modules/genres/dto/create-genres.dto';

@Injectable()
export class GenresService {
  constructor(private prisma: PrismaService) {}

  async getGenres(): Promise<any> {
    const genres = await this.prisma.genre.findMany();
    return genres.map((g) => ({
      ...g,
      id: g.id.toString(),
      tmdb_id: g.tmdb_id.toString(),
    }));
  }

  async findManyByTmdbIds(genreIds: number[]): Promise<Genre[]> {
    const genresInDb = await this.prisma.genre.findMany({
      where: {
        tmdb_id: { in: genreIds },
      },
    });
    return genresInDb;
  }

  // createGenres(body: CreateGenreDto): Promise<any> {
  //   // return this.prisma.genre.create({ data: body });
  // }
}
