import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../../common/services/prisma.service'

interface RegisterDto {
  email: string
  password: string
  name: string
}

interface LoginDto {
  email: string
  password: string
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<{ user: { id: string; email: string; name: string }; token: string }> {
    const existing = await this.prisma.user.findFirst({ where: { email: dto.email } })
    if (existing) {
      throw new ConflictException('Email already in use')
    }

    const passwordHash = await bcrypt.hash(dto.password, 12)

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        name: dto.name,
      },
    })

    const token = this.jwtService.sign({ sub: user.id })

    await this.prisma.userSession.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    return { user: { id: user.id, email: user.email, name: user.name }, token }
  }

  async login(dto: LoginDto): Promise<{ user: { id: string; email: string; name: string }; token: string }> {
    const user = await this.prisma.user.findFirst({ where: { email: dto.email, deletedAt: null } })
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash)
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const token = this.jwtService.sign({ sub: user.id })

    await this.prisma.userSession.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    return { user: { id: user.id, email: user.email, name: user.name }, token }
  }

  async me(userId: string): Promise<{ id: string; email: string; name: string; systemRole: string }> {
    const user = await this.prisma.user.findFirst({ where: { id: userId, deletedAt: null } })
    if (!user) {
      throw new UnauthorizedException()
    }
    return { id: user.id, email: user.email, name: user.name, systemRole: user.systemRole }
  }
}
