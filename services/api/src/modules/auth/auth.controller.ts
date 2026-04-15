import { Controller, Post, Get, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: unknown) {
    return this.authService.register(body)
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: unknown) {
    return this.authService.login(body)
  }

  @Get('me')
  me() {
    // T10에서 JwtAuthGuard 적용 예정
    return this.authService.me('stub-user-id')
  }
}
