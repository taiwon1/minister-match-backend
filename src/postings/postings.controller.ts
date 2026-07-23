import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PostingsService } from './postings.service';
import { CreatePostingDto } from './dto/create-posting.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('postings')
export class PostingsController {
  constructor(private readonly postingsService: PostingsService) {}

  @Get()
  findOpenPostings() {
    return this.postingsService.findOpenPostings();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CHURCH_ADMIN)
  findMyPostings(@CurrentUser() user: CurrentUserPayload) {
    return this.postingsService.findMyPostings(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postingsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CHURCH_ADMIN)
  create(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreatePostingDto) {
    return this.postingsService.create(user.userId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CHURCH_ADMIN)
  remove(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.postingsService.remove(user.userId, id);
  }
}
