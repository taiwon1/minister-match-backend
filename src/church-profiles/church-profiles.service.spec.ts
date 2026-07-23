import { Test, TestingModule } from '@nestjs/testing';
import { ChurchProfilesService } from './church-profiles.service';

describe('ChurchProfilesService', () => {
  let service: ChurchProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChurchProfilesService],
    }).compile();

    service = module.get<ChurchProfilesService>(ChurchProfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
