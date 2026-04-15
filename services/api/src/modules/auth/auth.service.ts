import { Injectable } from '@nestjs/common'

@Injectable()
export class AuthService {
  async register(_body: unknown) {
    // T10에서 구현
    return { message: 'register stub — T10' }
  }

  async login(_body: unknown) {
    // T10에서 구현
    return { message: 'login stub — T10' }
  }

  async me(_userId: string) {
    // T10에서 구현
    return { id: 'stub', email: 'stub@example.com', name: 'Stub User', role: 'USER' }
  }
}
