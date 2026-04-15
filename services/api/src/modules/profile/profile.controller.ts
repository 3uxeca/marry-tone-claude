import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ProfileService } from './profile.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('diagnosis-gate')
  getDiagnosisGate(@Req() req: any) {
    return this.profileService.getDiagnosisGate(req.user.id)
  }

  @Post('diagnosis-gate')
  @HttpCode(201)
  upsertDiagnosisGate(
    @Req() req: any,
    @Body() body: { experience: string; weddingRole: string },
  ) {
    return this.profileService.upsertDiagnosisGate(req.user.id, body)
  }
}
