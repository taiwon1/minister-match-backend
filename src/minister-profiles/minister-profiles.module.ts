import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinisterProfilesService } from './minister-profiles.service';
import { MinisterProfilesController } from './minister-profiles.controller';
import { MinisterProfile } from './entities/minister-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MinisterProfile])],
  controllers: [MinisterProfilesController],
  providers: [MinisterProfilesService],
})
export class MinisterProfilesModule {}
