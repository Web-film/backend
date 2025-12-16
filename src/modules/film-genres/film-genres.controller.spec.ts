import { Test, TestingModule } from '@nestjs/testing';
import { FilmGenresController } from './film-genres.controller';

describe('FilmGenresController', () => {
  let controller: FilmGenresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmGenresController],
    }).compile();

    controller = module.get<FilmGenresController>(FilmGenresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
