import { Test, TestingModule } from '@nestjs/testing';
import { MinisterProfilesController } from './minister-profiles.controller';

describe('MinisterProfilesController', () => {
  let controller: MinisterProfilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MinisterProfilesController],
    }).compile();

    controller = module.get<MinisterProfilesController>(MinisterProfilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
