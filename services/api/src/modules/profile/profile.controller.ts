import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { ProfileService } from './profile.service'

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('diagnosis-gate')
  getDiagnosisGate() {
    return this.profileService.getDiagnosisGate('stub-user-id')
  }

  @Post('diagnosis-gate')
  @HttpCode(HttpStatus.OK)
  setDiagnosisGate(@Body() body: unknown) {
    return this.profileService.setDiagnosisGate('stub-user-id', body)
  }
}
