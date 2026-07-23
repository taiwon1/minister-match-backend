import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posting, PostingStatus } from './entities/posting.entity';
import { CreatePostingDto } from './dto/create-posting.dto';
import { ChurchProfilesService } from '../church-profiles/church-profiles.service';

@Injectable()
export class PostingsService {
  constructor(
    @InjectRepository(Posting)
    private readonly postingRepository: Repository<Posting>,
    private readonly churchProfilesService: ChurchProfilesService,
  ) {}

  async create(userId: string, dto: CreatePostingDto) {
    const churchProfile = await this.churchProfilesService.findByUserId(userId);

    const posting = this.postingRepository.create({
      ...dto,
      churchProfileId: churchProfile.id,
    });

    return this.postingRepository.save(posting);
  }

  async findOpenPostings() {
    return this.postingRepository.find({
      where: { status: PostingStatus.OPEN },
      relations: { churchProfile: true },
      order: { serviceDate: 'ASC' },
    });
  }

  async findOne(id: string) {
    const posting = await this.postingRepository.findOne({
      where: { id },
      relations: { churchProfile: true },
    });

    if (!posting) {
      throw new NotFoundException('공고를 찾을 수 없습니다.');
    }

    return posting;
  }

  async findMyPostings(userId: string) {
    const churchProfile = await this.churchProfilesService.findByUserId(userId);

    return this.postingRepository.find({
      where: { churchProfileId: churchProfile.id },
      order: { createdAt: 'DESC' },
    });
  }

  async remove(userId: string, postingId: string) {
    const posting = await this.findOne(postingId);
    const churchProfile = await this.churchProfilesService.findByUserId(userId);

    if (posting.churchProfileId !== churchProfile.id) {
      throw new ForbiddenException('본인이 등록한 공고만 삭제할 수 있습니다.');
    }

    await this.postingRepository.remove(posting);
    return { message: '삭제되었습니다.' };
  }
}
