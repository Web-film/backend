import { Test, TestingModule } from '@nestjs/testing';
import { EpisodeViewsService } from './episode-views.service';

describe('EpisodeViewsService', () => {
  let service: EpisodeViewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EpisodeViewsService],
    }).compile();

    service = module.get<EpisodeViewsService>(EpisodeViewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
