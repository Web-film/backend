import { Test, TestingModule } from '@nestjs/testing';
import { FilmDailyViewService } from './film-daily-view.service';

describe('FilmDailyViewService', () => {
  let service: FilmDailyViewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilmDailyViewService],
    }).compile();

    service = module.get<FilmDailyViewService>(FilmDailyViewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
