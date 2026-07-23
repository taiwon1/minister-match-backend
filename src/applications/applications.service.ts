import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application, ApplicationStatus } from './entities/application.entity';
import { PostingsService } from '../postings/postings.service';
import { MinisterProfilesService } from '../minister-profiles/minister-profiles.service';
import { PostingStatus } from '../postings/entities/posting.entity';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    private readonly postingsService: PostingsService,
    private readonly ministerProfilesService: MinisterProfilesService,
  ) {}

  async apply(userId: string, postingId: string) {
    const posting = await this.postingsService.findOne(postingId);

    if (posting.status !== PostingStatus.OPEN) {
      throw new BadRequestException('마감된 공고입니다.');
    }

    const ministerProfile = await this.ministerProfilesService.findByUserId(userId);

    const existing = await this.applicationRepository.findOne({
      where: { postingId, ministerProfileId: ministerProfile.id },
    });

    if (existing) {
      throw new ConflictException('이미 지원한 공고입니다.');
    }

    const application = this.applicationRepository.create({
      postingId,
      ministerProfileId: ministerProfile.id,
    });

    return this.applicationRepository.save(application);
  }

  async findByPosting(userId: string, postingId: string) {
    const posting = await this.postingsService.findOne(postingId);

    if (posting.churchProfile.userId !== userId) {
      throw new ForbiddenException('본인이 등록한 공고의 지원자만 조회할 수 있습니다.');
    }

    return this.applicationRepository.find({
      where: { postingId },
      relations: { ministerProfile: true },
      order: { createdAt: 'ASC' },
    });
  }

  async findMyApplications(userId: string) {
    const ministerProfile = await this.ministerProfilesService.findByUserId(userId);

    return this.applicationRepository.find({
      where: { ministerProfileId: ministerProfile.id },
      relations: { posting: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: { posting: { churchProfile: true }, ministerProfile: true },
    });

    if (!application) {
      throw new NotFoundException('지원 내역을 찾을 수 없습니다.');
    }

    return application;
  }
}
