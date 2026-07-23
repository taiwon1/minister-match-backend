import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostingsService } from './postings.service';
import { PostingsController } from './postings.controller';
import { Posting } from './entities/posting.entity';
import { ChurchProfilesModule } from '../church-profiles/church-profiles.module';

@Module({
  imports: [TypeOrmModule.forFeature([Posting]), ChurchProfilesModule],
  controllers: [PostingsController],
  providers: [PostingsService],
  exports: [PostingsService],
})
export class PostingsModule {}
