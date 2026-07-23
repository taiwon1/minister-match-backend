import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Application, ApplicationStatus } from './entities/application.entity';
import { Posting, PostingStatus } from '../postings/entities/posting.entity';
import { PostingsService } from '../postings/postings.service';
import { MinisterProfilesService } from '../minister-profiles/minister-profiles.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    private readonly postingsService: PostingsService,
    private readonly ministerProfilesService: MinisterProfilesService,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
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

  async confirm(userId: string, applicationId: string) {
    return this.dataSource.transaction(async (manager) => {
      // 1. Application 행에만 락을 건다 (조인 없이 단일 테이블 락)
      const application = await manager.findOne(Application, {
        where: { id: applicationId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!application) {
        throw new NotFoundException('지원 내역을 찾을 수 없습니다.');
      }

      // 2. 연관된 posting/churchProfile은 락 없이 별도 조회
      const posting = await manager.findOne(Posting, {
        where: { id: application.postingId },
        relations: { churchProfile: true },
      });

      if (!posting) {
        throw new NotFoundException('공고를 찾을 수 없습니다.');
      }

      if (posting.churchProfile.userId !== userId) {
        throw new ForbiddenException('본인이 등록한 공고의 지원만 확정할 수 있습니다.');
      }

      if (posting.status !== PostingStatus.OPEN) {
        throw new BadRequestException('이미 마감된 공고입니다.');
      }

      application.status = ApplicationStatus.CONFIRMED;
      await manager.save(application);

      await manager
        .createQueryBuilder()
        .update(Application)
        .set({ status: ApplicationStatus.REJECTED })
        .where('postingId = :postingId', { postingId: application.postingId })
        .andWhere('id != :applicationId', { applicationId })
        .andWhere('status = :status', { status: ApplicationStatus.PENDING })
        .execute();

      await manager
        .createQueryBuilder()
        .update(Posting)
        .set({ status: PostingStatus.CLOSED })
        .where('id = :postingId', { postingId: application.postingId })
        .execute();

      return application;
    });
  }

  async getMatchedContact(userId: string, applicationId: string) {
    const application = await this.findOne(applicationId);

    if (application.status !== ApplicationStatus.CONFIRMED) {
      throw new BadRequestException('매칭이 확정되지 않은 지원 건입니다.');
    }

    const isChurchSide = application.posting.churchProfile.userId === userId;
    const isMinisterSide = application.ministerProfile.userId === userId;

    if (!isChurchSide && !isMinisterSide) {
      throw new ForbiddenException('매칭 당사자만 연락처를 조회할 수 있습니다.');
    }

    const counterpartUserId = isChurchSide
      ? application.ministerProfile.userId
      : application.posting.churchProfile.userId;

    return this.usersService.findById(counterpartUserId);
  }
}
