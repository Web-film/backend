import { Test, TestingModule } from '@nestjs/testing';
import { EpisodeViewsController } from './episode-views.controller';

describe('EpisodeViewsController', () => {
  let controller: EpisodeViewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EpisodeViewsController],
    }).compile();

    controller = module.get<EpisodeViewsController>(EpisodeViewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
