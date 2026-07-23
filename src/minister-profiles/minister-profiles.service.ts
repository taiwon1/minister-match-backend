import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MinisterProfile } from './entities/minister-profile.entity';
import { CreateMinisterProfileDto } from './dto/create-minister-profile.dto';

@Injectable()
export class MinisterProfilesService {
  constructor(
    @InjectRepository(MinisterProfile)
    private readonly profileRepository: Repository<MinisterProfile>,
  ) {}

  async create(userId: string, dto: CreateMinisterProfileDto) {
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
