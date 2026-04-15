import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../common/services/prisma.service'
import { resolveNextRoute } from '@marry-tone/contracts'

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getDiagnosisGate(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: { diagnosisGate: true },
    })

    if (!profile || !profile.diagnosisGate) {
      throw new NotFoundException('DiagnosisGate not found')
    }

    return profile.diagnosisGate
  }

  async upsertDiagnosisGate(
    userId: string,
    dto: { experience: string; weddingRole: string },
  ) {
    const profile = await this.prisma.profile.upsert({
      where: { userId },
      create: { userId, weddingRole: dto.weddingRole as any },
      update: { weddingRole: dto.weddingRole as any },
    })

    const gate = await this.prisma.diagnosisGate.upsert({
      where: { profileId: profile.id },
      create: {
        profileId: profile.id,
        experience: dto.experience as any,
        weddingRole: dto.weddingRole as any,
        nextRoute: resolveNextRoute(dto.experience as any),
        completedAt: new Date(),
      },
      update: {
        experience: dto.experience as any,
        weddingRole: dto.weddingRole as any,
        nextRoute: resolveNextRoute(dto.experience as any),
        completedAt: new Date(),
      },
    })

    return gate
  }
}
