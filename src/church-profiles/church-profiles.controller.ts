import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ChurchProfilesService } from './church-profiles.service';
import { CreateChurchProfileDto } from './dto/create-church-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('church-profiles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChurchProfilesController {
  constructor(private readonly profilesService: ChurchProfilesService) {}

  @Post()
  @Roles(UserRole.CHURCH_ADMIN)
  create(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateChurchProfileDto) {
    return this.profilesService.create(user.userId, dto);
  }

  @Get('me')
  @Roles(UserRole.CHURCH_ADMIN)
  getMyProfile(@CurrentUser() user: CurrentUserPayload) {
    return this.profilesService.findByUserId(user.userId);
  }
}
