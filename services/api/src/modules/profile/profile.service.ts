import { Injectable } from '@nestjs/common'

@Injectable()
export class ProfileService {
  async getDiagnosisGate(_userId: string) {
    // T12에서 DB 연동 구현
    return null
  }

  async setDiagnosisGate(_userId: string, _body: unknown) {
    // T12에서 구현
    return { message: 'diagnosis-gate stub — T12' }
  }
}
