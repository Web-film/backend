import { Test, TestingModule } from '@nestjs/testing';
import { FilmGenresService } from './film-genres.service';

describe('FilmGenresService', () => {
  let service: FilmGenresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilmGenresService],
    }).compile();

    service = module.get<FilmGenresService>(FilmGenresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
