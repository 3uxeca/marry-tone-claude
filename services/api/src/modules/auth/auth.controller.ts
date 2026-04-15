import { Controller, Post, Get, Body, HttpCode, HttpStatus, UseGuards, Req, Res } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

interface RegisterBody {
  email: string
  password: string
  name: string
}

interface LoginBody {
  email: string
  password: string
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: RegisterBody,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Res() reply: any,
  ) {
    const result = await this.authService.register(body)
    reply.setCookie('marry_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    })
    return reply.status(HttpStatus.CREATED).send({ success: true, data: { user: result.user } })
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: LoginBody,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Res() reply: any,
  ) {
    const result = await this.authService.login(body)
    reply.setCookie('marry_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    })
    return reply.status(HttpStatus.OK).send({ success: true, data: { user: result.user } })
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async me(@Req() req: any) {
    return this.authService.me(req.user.id)
  }
}
