import { Test, TestingModule } from '@nestjs/testing';
import { ChurchProfilesController } from './church-profiles.controller';

describe('ChurchProfilesController', () => {
  let controller: ChurchProfilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChurchProfilesController],
    }).compile();

    controller = module.get<ChurchProfilesController>(ChurchProfilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
