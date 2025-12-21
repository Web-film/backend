import { Test, TestingModule } from '@nestjs/testing';
import { FilmDailyViewController } from './film-daily-view.controller';

describe('FilmDailyViewController', () => {
  let controller: FilmDailyViewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmDailyViewController],
    }).compile();

    controller = module.get<FilmDailyViewController>(FilmDailyViewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
