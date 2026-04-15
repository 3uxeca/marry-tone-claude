import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    // T10에서 실제 JWT 검증 구현
    if (!request.headers.authorization) throw new UnauthorizedException()
    return true
  }
}
