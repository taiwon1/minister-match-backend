import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post('postings/:id/applications')
  @Roles(UserRole.MINISTER)
  apply(@CurrentUser() user: CurrentUserPayload, @Param('id') postingId: string) {
    return this.applicationsService.apply(user.userId, postingId);
  }

  @Get('postings/:id/applications')
  @Roles(UserRole.CHURCH_ADMIN)
  findByPosting(@CurrentUser() user: CurrentUserPayload, @Param('id') postingId: string) {
    return this.applicationsService.findByPosting(user.userId, postingId);
  }

  @Get('applications/me')
  @Roles(UserRole.MINISTER)
  findMyApplications(@CurrentUser() user: CurrentUserPayload) {
    return this.applicationsService.findMyApplications(user.userId);
  }
}
