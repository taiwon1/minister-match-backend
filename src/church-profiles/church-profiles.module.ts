import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChurchProfilesService } from './church-profiles.service';
import { ChurchProfilesController } from './church-profiles.controller';
import { ChurchProfile } from './entities/church-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChurchProfile])],
  controllers: [ChurchProfilesController],
  providers: [ChurchProfilesService],
})
export class ChurchProfilesModule {}
