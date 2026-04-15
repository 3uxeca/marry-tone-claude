import { Controller, Get } from '@nestjs/common'

@Controller('couple')
export class CoupleController {
  @Get()
  getCouple() {
    return { message: 'couple stub — S2' }
  }
}
