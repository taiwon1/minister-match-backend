import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { MinisterProfilesService } from './minister-profiles.service';
import { CreateMinisterProfileDto } from './dto/create-minister-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('minister-profiles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MinisterProfilesController {
  constructor(private readonly profilesService: MinisterProfilesService) {}

  @Post()
  @Roles(UserRole.MINISTER)
  create(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateMinisterProfileDto) {
    return this.profilesService.create(user.userId, dto);
  }

  @Get('me')
  @Roles(UserRole.MINISTER)
  getMyProfile(@CurrentUser() user: CurrentUserPayload) {
    return this.profilesService.findByUserId(user.userId);
  }
}
