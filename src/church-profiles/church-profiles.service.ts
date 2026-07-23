import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChurchProfile } from './entities/church-profile.entity';
import { CreateChurchProfileDto } from './dto/create-church-profile.dto';

@Injectable()
export class ChurchProfilesService {
  constructor(
    @InjectRepository(ChurchProfile)
    private readonly profileRepository: Repository<ChurchProfile>,
  ) {}

  async create(userId: string, dto: CreateChurchProfileDto) {
    const existing = await this.profileRepository.findOne({ where: { userId } });

    if (existing) {
      throw new ConflictException('이미 프로필이 등록되어 있습니다.');
    }

    const profile = this.profileRepository.create({ ...dto, userId });
    return this.profileRepository.save(profile);
  }

  async findByUserId(userId: string) {
    const profile = await this.profileRepository.findOne({ where: { userId } });

    if (!profile) {
      throw new NotFoundException('프로필을 찾을 수 없습니다.');
    }

    return profile;
  }
}
