import { Test, TestingModule } from '@nestjs/testing';
import { MinisterProfilesService } from './minister-profiles.service';

describe('MinisterProfilesService', () => {
  let service: MinisterProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MinisterProfilesService],
    }).compile();

    service = module.get<MinisterProfilesService>(MinisterProfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
